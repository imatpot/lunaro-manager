use std::{collections::HashMap, time::Duration};

use poise::serenity_prelude::{prelude::TypeMapKey, Context, Member, Presence, UserId};
use tokio::time::sleep;
use tokio_util::sync::CancellationToken;

use crate::{
    env::Environment,
    traits::config_file::ConfigFile,
    types::error::Error,
    util::{lunaro_tracking, play},
};

type CancellationSchedule = HashMap<UserId, CancellationToken>;

/// Handles the presence update event.
pub async fn handle(context: &Context, presence: &Presence) -> Result<(), Error> {
    let env = Environment::instance();
    let tracking_config = lunaro_tracking::LunaroTrackingConfig::instance().await;

    if tracking_config.is_blocked(&presence.user.id) {
        return Ok(());
    }

    let member = &mut context
        .http
        .get_member(presence.guild_id.unwrap(), presence.user.id)
        .await?;

    let has_playing_role = member
        .user
        .has_role(&context, env.home_guild_id, env.playing_role_id)
        .await?;

    let is_in_game = lunaro_tracking::is_playing_lunaro(presence).is_ok_and(|value| value);

    if is_in_game && !has_playing_role {
        add_ready_role(member, &context).await?;
    } else if !is_in_game && has_playing_role {
        schedule_ready_removal(member.clone(), &context).await;
    }

    Ok(())
}

async fn add_ready_role(member: &mut Member, context: &Context) -> Result<(), Error> {
    match context.get_scheduled_cancellation(member.user.id).await {
        None => play::add(member, context).await,
        Some(cancellation_token) => {
            cancellation_token.cancel();
            Ok(context
                .remove_cancellation_schedule_for(member.user.id)
                .await)
        }
    }
}

async fn schedule_ready_removal(mut member: Member, context: &Context) {
    if let Some(_) = context.get_scheduled_cancellation(member.user.id).await {
        log::warn!(
            "Already scheduled ready removal for {} ({})",
            member.user.tag(),
            member.user.id
        );

        return;
    }

    let cancellation_token = CancellationToken::new();

    context
        .schedule_cancellation(member.user.id, cancellation_token.clone())
        .await;

    log::debug!(
        "Scheduling ready removal for {} ({})",
        member.user.tag(),
        member.user.id
    );

    let context = context.clone();

    tokio::spawn(async move {
        tokio::select! {
            _ = cancellation_token.cancelled() => {
                log::debug!("Cancelling ready removal for {} ({})", member.user.tag(), member.user.id);
            }
            _ = sleep(Duration::from_secs(60)) => {
                context.remove_cancellation_schedule_for(member.user.id).await;
                play::remove(&mut member, &context).await.unwrap_or_else(|error| {
                    log::error!("Failed to remove ready role for {} ({}): {}", member.user.tag(), member.user.id, error);
                });
            }
        }
    });
}

struct CancellationScheduleData {
    pub schedule: CancellationSchedule,
}

impl Default for CancellationScheduleData {
    fn default() -> Self {
        Self {
            schedule: CancellationSchedule::new(),
        }
    }
}

trait RemovalScheduler {
    async fn cancellation_schedule(&self) -> CancellationSchedule;
    async fn get_scheduled_cancellation(&self, user_id: UserId) -> Option<CancellationToken>;
    async fn schedule_cancellation(&self, user_id: UserId, token: CancellationToken);
    async fn remove_cancellation_schedule_for(&self, user_id: UserId);
}

impl RemovalScheduler for Context {
    async fn cancellation_schedule(&self) -> CancellationSchedule {
        match self.data.read().await.get::<CancellationScheduleData>() {
            Some(data) => data.schedule.clone(),
            None => CancellationSchedule::new(),
        }
    }

    async fn get_scheduled_cancellation(&self, user_id: UserId) -> Option<CancellationToken> {
        self.cancellation_schedule()
            .await
            .iter()
            .find(|schedule| *schedule.0 == user_id)
            .map(|schedule| schedule.1.clone())
    }

    async fn schedule_cancellation(&self, user_id: UserId, schedule: CancellationToken) {
        let mut scheduled = self.cancellation_schedule().await;

        if !scheduled.contains_key(&user_id) {
            scheduled.insert(user_id, schedule);
            self.data
                .write()
                .await
                .insert::<CancellationScheduleData>(CancellationScheduleData {
                    schedule: scheduled,
                });
        }
    }

    async fn remove_cancellation_schedule_for(&self, user_id: UserId) {
        let mut scheduled = self.cancellation_schedule().await;

        if scheduled.contains_key(&user_id) {
            scheduled.remove(&user_id);
            self.data
                .write()
                .await
                .insert::<CancellationScheduleData>(CancellationScheduleData {
                    schedule: scheduled,
                });
        }
    }
}

impl TypeMapKey for CancellationScheduleData {
    type Value = Self;
}

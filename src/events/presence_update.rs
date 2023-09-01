use poise::serenity_prelude::{Context, Presence};

use crate::{
    env::Environment,
    traits::config_file::ConfigFile,
    types::error::Error,
    util::{activity_tracking, rtp},
};

/// Handles the presence update event.
pub async fn handle(context: Context, presence: &Presence) -> Result<(), Error> {
    let env = Environment::instance();
    let tracking_config = activity_tracking::Config::instance().await;

    if tracking_config.blocklist.contains(&presence.user.id.0) {
        return Ok(());
    }

    drop(tracking_config);

    let member = &mut context
        .http
        .get_member(presence.guild_id.unwrap().0, presence.user.id.0)
        .await?;

    let is_ready = member
        .user
        .has_role(&context, env.home_guild_id, env.ready_role_id)
        .await?;

    let is_playing_lunaro =
        activity_tracking::is_playing_lunaro(presence).is_ok_and(|value| value);

    if is_playing_lunaro && !is_ready {
        rtp::add(member, &context).await?;
    } else if !is_playing_lunaro && is_ready {
        rtp::remove(member, &context).await?;
    }

    Ok(())
}

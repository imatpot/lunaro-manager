use poise::serenity_prelude::{Context, Presence};

use crate::{
    env::Environment,
    traits::config_file::ConfigFile,
    types::error::Error,
    util::{lunaro_tracking, play},
};

/// Handles the presence update event.
pub async fn handle(context: Context, presence: &Presence) -> Result<(), Error> {
    let env = Environment::instance();
    let tracking_config = lunaro_tracking::Config::instance().await;

    if tracking_config.is_blocked(&presence.user.id) {
        return Ok(());
    }

    let member = &mut context
        .http
        .get_member(presence.guild_id.unwrap(), presence.user.id)
        .await?;

    let is_playing = member
        .user
        .has_role(&context, env.home_guild_id, env.playing_role_id)
        .await?;

    let is_playing_lunaro = lunaro_tracking::is_playing_lunaro(presence).is_ok_and(|value| value);

    if is_playing_lunaro && !is_playing {
        play::add(member, &context).await?;
    } else if !is_playing_lunaro && is_playing {
        play::remove(member, &context).await?;
    }

    Ok(())
}

use poise::command;

use crate::{
    types::{error::Error, poise::PoiseContext},
    util::activity_tracking,
};

/// 👁 Manage your tracking permissions
#[command(slash_command, rename = "tracking", subcommands("pause", "resume"))]
pub async fn run(_context: PoiseContext<'_>) -> Result<(), Error> {
    // Handled in subcommands
    Ok(())
}

/// ⛔ Pause activity tracking on your account
#[command(slash_command)]
async fn pause(context: PoiseContext<'_>) -> Result<(), Error> {
    let member = context.author();

    activity_tracking::deny_tracking_for(member)?;

    context
        .send(|message| {
            message
                .content("⛔ Paused activity tracking for your account")
                .ephemeral(true)
        })
        .await?;

    Ok(())
}

/// ⚡ Resume activity tracking on your account
#[command(slash_command)]
async fn resume(context: PoiseContext<'_>) -> Result<(), Error> {
    let member = context.author();

    activity_tracking::allow_tracking_for(member)?;

    context
        .send(|message| {
            message
                .content("⚡ Resumed activity tracking for your account")
                .ephemeral(true)
        })
        .await?;

    Ok(())
}

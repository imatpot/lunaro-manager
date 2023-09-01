use poise::serenity_prelude::{Context, Ready};

use crate::types::error::Error;

/// Handles the ready event.
pub async fn handle(context: Context, ready: &Ready) -> Result<(), Error> {
    let bot_tag = ready.user.tag();
    log::info!("{} is ready", bot_tag);
    context.idle().await;

    Ok(())
}

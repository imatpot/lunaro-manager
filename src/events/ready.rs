use poise::serenity_prelude::{Context, Ready};

use crate::types::error::Error;

/// Handles the ready event.
pub async fn handle(context: &Context, ready: &Ready) -> Result<(), Error> {
    log::info!("{} ({}) is ready", ready.user.tag(), ready.user.id);
    context.online();
    Ok(())
}

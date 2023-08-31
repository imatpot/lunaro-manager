use chrono::{DateTime, Utc};
use poise::command;

use crate::types::{error::Error, poise::PoiseContext};

/// 🏓 Check the bot's connection latency
#[command(slash_command, rename = "ping")]
pub async fn run(context: PoiseContext<'_>) -> Result<(), Error> {
    let now = Utc::now();
    let interaction_created =
        DateTime::parse_from_rfc3339(&context.created_at().to_rfc3339())?.with_timezone(&Utc);

    let latency = now
        .signed_duration_since(interaction_created)
        .num_milliseconds()
        .abs();

    log::debug!("Latency: {latency}ms");

    context
        .send(|reply| reply.content(format!("🏓  My ping is around {latency}ms")))
        .await?;

    Ok(())
}

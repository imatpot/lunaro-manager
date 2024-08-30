use chrono::{DateTime, Utc};
use poise::{command, CreateReply};

use crate::types::{error::Error, poise::PoiseContext};

/// 🏓 Check the bot's connection latency
#[command(slash_command, rename = "ping")]
pub async fn run(context: PoiseContext<'_>) -> Result<(), Error> {
    let now = Utc::now();

    let created_at = match context.created_at().to_rfc3339() {
        Some(created_at) => created_at,
        None => {
            context
                .send(CreateReply::default().content("🏓  I'm not sure how long I've been online"))
                .await?;

            return Ok(());
        }
    };

    let interaction_created = DateTime::parse_from_rfc3339(&created_at)?.with_timezone(&Utc);

    let latency = now
        .signed_duration_since(interaction_created)
        .num_milliseconds()
        .abs();

    log::debug!("Latency: {latency}ms");

    context
        .send(CreateReply::default().content(format!("🏓  My ping is around {latency}ms")))
        .await?;

    Ok(())
}

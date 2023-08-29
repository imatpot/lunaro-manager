use chrono::{DateTime, Utc};
use poise::{command, say_reply};

use crate::types::poise::{Error, PoiseContext};

/// Check whether the bot is responsive.
#[command(rename = "ping", slash_command, prefix_command)]
pub async fn execute(context: PoiseContext<'_>) -> Result<(), Error> {
    let now = Utc::now();
    let interaction_timestamp = DateTime::parse_from_rfc3339(&context.created_at().to_rfc3339());

    match interaction_timestamp {
        Ok(interaction_timestamp) => {
            let latency = now
                .signed_duration_since(interaction_timestamp)
                .num_milliseconds()
                .abs();

            log::debug!("Latency: {latency}ms");
            say_reply(context, format!("Pong! It took me `{latency}ms` to react")).await?;
        }
        Err(_) => {
            say_reply(context, format!("Pong!")).await?;
        }
    }

    Ok(())
}

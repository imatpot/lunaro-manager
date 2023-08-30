use poise::command;

use crate::types::{error::Error, poise::PoiseContext};

/// 🤝 Let's work together
#[command(slash_command, rename = "contribute")]
pub async fn run(context: PoiseContext<'_>) -> Result<(), Error> {
    context
        .send(|reply| {
            reply.content(
                [
                    "🤝 Feel like helping out? Create an issue or pull request on GitHub:",
                    "https://github.com/imatpot/lunaro-manager",
                ]
                .join("\n"),
            )
        })
        .await?;

    Ok(())
}

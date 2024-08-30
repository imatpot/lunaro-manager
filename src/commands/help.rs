use poise::{command, CreateReply};

use crate::types::{error::Error, poise::PoiseContext};

/// ❓ Learn how to use Lunaro Manager
#[command(slash_command, rename = "help")]
pub async fn run(context: PoiseContext<'_>) -> Result<(), Error> {
    context
        .send(
            CreateReply::default().content(
                [
                    "👋  Swazdo-lah, surah!",
                    "",
                    "I'm the Lunaro Manager, and my job is to help you with all things Lunaro.",
                    "",
                    "Type `/` and use the sidebar to explore my features, or check out the *Usage* section on my GitHub page:",
                    "https://github.com/imatpot/lunaro-manager#usage",
                ]
                .join("\n"),
            )
        )
        .await?;

    Ok(())
}

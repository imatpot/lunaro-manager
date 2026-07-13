use poise::{CreateReply, command};

use crate::{
	types::{error::Error, poise::PoiseContext},
	util::lunaro_tracking,
};

/// 🕵️ Manage your tracking permissions
#[command(slash_command, rename = "tracking", subcommands("pause", "resume", "hide"))]
pub async fn run(_context: PoiseContext<'_>) -> Result<(), Error> {
	// Handled in subcommands
	Ok(())
}

/// 💤 Pause Lunaro tracking for your account
#[command(slash_command)]
async fn pause(context: PoiseContext<'_>) -> Result<(), Error> {
	let member = context.author();

	lunaro_tracking::deny_for(member).await?;

	context
		.send(
			CreateReply::default()
				.content("💤  Paused Lunaro tracking for your account")
				.ephemeral(true),
		)
		.await?;

	Ok(())
}

/// 👻 Prevent others from being notified when you play Lunaro
#[command(slash_command)]
async fn hide(context: PoiseContext<'_>) -> Result<(), Error> {
	let member = context.author();

	lunaro_tracking::hide_for(member).await?;

	context
		.send(
			CreateReply::default()
				.content("👻  Hidden Lunaro tracking for your account")
				.ephemeral(true),
		)
		.await?;

	Ok(())
}

/// 👁️ Resume Lunaro tracking for your account
#[command(slash_command)]
async fn resume(context: PoiseContext<'_>) -> Result<(), Error> {
	let member = context.author();

	lunaro_tracking::allow_for(member).await?;

	context
		.send(
			CreateReply::default()
				.content("👁️  Resumed Lunaro tracking for your account")
				.ephemeral(true),
		)
		.await?;

	Ok(())
}

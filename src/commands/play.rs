use poise::{command, CreateReply};

use crate::{
	env::Environment,
	types::{error::Error, poise::PoiseContext},
	util::{lunaro_tracking, playing_role},
};

/// 🥍 Manage your Lunaro status
#[command(slash_command, rename = "play", subcommands("now", "later", "info"))]
pub async fn run(_context: PoiseContext<'_>) -> Result<(), Error> {
	// Handled in subcommands
	Ok(())
}

/// 🟢 Equip your Arcata
#[command(slash_command)]
async fn now(
	context: PoiseContext<'_>,
	#[rename = "disable-tracking"]
	#[description = "Whether you also want to disable Lunaro tracking for the time being"]
	disable_lunaro_tracking: Option<bool>,
) -> Result<(), Error> {
	let env = Environment::instance();

	let member = &mut context
		.serenity_context()
		.http
		.get_member(env.home_guild_id.into(), context.author().id)
		.await?;

	if let Some(true) = disable_lunaro_tracking {
		lunaro_tracking::deny_for(&member.user).await?;
	}

	playing_role::add(member, context.serenity_context()).await?;

	context
		.send(
			CreateReply::default()
				.content(format!("🟢  Good luck in the arena, Tenno!"))
				.ephemeral(true),
		)
		.await?;

	Ok(())
}

/// ⭕ Unequip your Arcata
#[command(slash_command)]
async fn later(
	context: PoiseContext<'_>,
	#[rename = "enable-tracking"]
	#[description = "Whether you also want to (re-) enable Lunaro tracking again"]
	enable_lunaro_tracking: Option<bool>,
) -> Result<(), Error> {
	let env = Environment::instance();

	let member = &mut context
		.serenity_context()
		.http
		.get_member(env.home_guild_id, context.author().id)
		.await?;

	if let Some(true) = enable_lunaro_tracking {
		lunaro_tracking::allow_for(&member.user).await?;
	}

	playing_role::remove(member, context.serenity_context()).await?;

	context
		.send(
			CreateReply::default()
				.content(format!("⭕  The arena eagerly awaits your return."))
				.ephemeral(true),
		)
		.await?;

	Ok(())
}

/// 👀 Check who's equipped their Arcata
#[command(slash_command)]
async fn info(context: PoiseContext<'_>) -> Result<(), Error> {
	let playing_member_count = playing_role::count(context.serenity_context()).await?;

	let verb = match playing_member_count {
		1 => "is",
		_ => "are",
	};

	context
		.send(CreateReply::default().content(format!(
			"👀  There {verb} {playing_member_count} Tenno playing Lunaro"
		)))
		.await?;

	Ok(())
}

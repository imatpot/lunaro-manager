use poise::serenity_prelude::{Context, Member};

use crate::{
	env::Environment, traits::config_file::ConfigFile, types::error::Error,
	util::lunaro_tracking::LunaroTrackingConfig,
};

/// Count how many members have the playing role.
pub async fn count(context: &Context) -> Result<usize, Error> {
	let env = Environment::instance();

	let members = context
		.http
		.get_guild_members(env.home_guild_id, None, None)
		.await?;

	let playing_member_count = members
		.iter()
		.filter(|member| {
			member
				.roles
				.iter()
				.any(|role_id| role_id == &env.playing_role_id)
		})
		.count();

	Ok(playing_member_count)
}

/// Add the playing role to a member.
pub async fn add(member: &mut Member, context: &Context) -> Result<(), Error> {
	member
		.add_role(context, Environment::instance().playing_role_id)
		.await?;

	let tracking_config = LunaroTrackingConfig::instance().await;
	if !tracking_config.is_hidden(&member.user.id) {
		let display_name = match &member.nick {
			Some(nick) => nick,
			None => &member.user.name,
		};

		let env = Environment::instance();
		let notification_channel = env.notification_channel_id;
		notification_channel
			.say(
				&context.http,
				format!("🟢  {} is now playing Lunaro", display_name),
			)
			.await?;
	}

	log::debug!(
		"Added {} ({}) to playing role",
		member.user.tag(),
		member.user.id
	);

	Ok(())
}

/// Remove the playing role from a member.
pub async fn remove(member: &mut Member, context: &Context) -> Result<(), Error> {
	member
		.remove_role(context, Environment::instance().playing_role_id)
		.await?;

	let tracking_config = LunaroTrackingConfig::instance().await;
	if !tracking_config.is_hidden(&member.user.id) {
		let display_name = match &member.nick {
			Some(nick) => nick,
			None => &member.user.name,
		};

		let env = Environment::instance();
		let notification_channel = env.notification_channel_id;
		notification_channel
			.say(
				&context.http,
				format!("⭕  {} is no longer playing Lunaro", display_name),
			)
			.await?;
	}

	log::debug!(
		"Removed {} ({}) from playing role",
		member.user.tag(),
		member.user.id
	);

	Ok(())
}

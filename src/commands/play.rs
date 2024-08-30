use poise::{command, CreateReply};

use crate::{
    env::Environment,
    types::{error::Error, poise::PoiseContext},
    util::play,
};

/// 🥍 Manage your Lunaro status
#[command(slash_command, rename = "play", subcommands("now", "later", "info"))]
pub async fn run(_context: PoiseContext<'_>) -> Result<(), Error> {
    // Handled in subcommands
    Ok(())
}

/// 🟢 Equip your Arcata
#[command(slash_command)]
async fn now(context: PoiseContext<'_>) -> Result<(), Error> {
    let env = Environment::instance();

    let member = &mut context
        .serenity_context()
        .http
        .get_member(env.home_guild_id.into(), context.author().id)
        .await?;

    play::add(member, context.serenity_context()).await?;

    let display_name = match &member.nick {
        Some(nick) => nick,
        None => &member.user.name,
    };

    context
        .send(
            CreateReply::default()
                .content(format!("🟢  {display_name} is now available for Lunaro")),
        )
        .await?;

    Ok(())
}

/// ⭕ Unequip your Arcata
#[command(slash_command)]
async fn later(context: PoiseContext<'_>) -> Result<(), Error> {
    let env = Environment::instance();

    let member = &mut context
        .serenity_context()
        .http
        .get_member(env.home_guild_id, context.author().id)
        .await?;

    let display_name = match &member.nick {
        Some(nick) => nick,
        None => &member.user.name,
    };

    context
        .send(CreateReply::default().content(format!(
            "⭕  {display_name} is no longer available for Lunaro"
        )))
        .await?;

    play::remove(member, context.serenity_context()).await?;

    Ok(())
}

/// 👀 Check who's equipped their Arcata
#[command(slash_command)]
async fn info(context: PoiseContext<'_>) -> Result<(), Error> {
    let playing_member_count = play::count(context.serenity_context()).await?;

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
use poise::command;

use crate::{
    types::{error::Error, poise::PoiseContext},
    util::ready,
};

/// 🥍 Manage your ready status
#[command(slash_command, rename = "rtp", subcommands("join", "leave"))]
pub async fn run(_context: PoiseContext<'_>) -> Result<(), Error> {
    // Handled in subcommands
    Ok(())
}

/// 🟢 Equip your Arcata
#[command(slash_command)]
async fn join(context: PoiseContext<'_>) -> Result<(), Error> {
    let member = &mut context
        .serenity_context()
        .http
        .get_member(context.guild_id().unwrap().0, context.author().id.0)
        .await?;

    ready::add(member, context).await?;

    let display_name = match &member.nick {
        Some(nick) => nick,
        None => &member.user.name,
    };

    context
        .send(|message| {
            message.content(format!(
                "🟢  {display_name} is now available for Lunaro"
            ))
        })
        .await?;

    Ok(())
}

/// ⭕ Unequip your Arcata
#[command(slash_command)]
async fn leave(context: PoiseContext<'_>) -> Result<(), Error> {
    let member = &mut context
        .serenity_context()
        .http
        .get_member(context.guild_id().unwrap().0, context.author().id.0)
        .await?;

    let display_name = match &member.nick {
        Some(nick) => nick,
        None => &member.user.name,
    };

    context
        .send(|message| {
            message.content(format!(
                "⭕  {display_name} is no longer available for Lunaro"
            ))
        })
        .await?;

    ready::remove(member, context).await?;

    Ok(())
}

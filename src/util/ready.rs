use poise::serenity_prelude::Member;

use crate::{
    env::Environment,
    types::{error::Error, poise::PoiseContext},
};

pub async fn count(context: PoiseContext<'_>) -> Result<i32, Error> {
    let ready_role_id = Environment::load()?.ready_role_id;

    let members = context
        .serenity_context()
        .http
        .get_guild_members(context.guild_id().unwrap().0, None, None)
        .await?;

    let ready_member_count = members
        .iter()
        .filter(|member| {
            member
                .roles
                .iter()
                .any(|role_id| role_id.0 == ready_role_id)
        })
        .fold(0, |acc, _| acc + 1);

    Ok(ready_member_count)
}

/// Add the ready role to a member.
pub async fn add(member: &mut Member, context: PoiseContext<'_>) -> Result<(), Error> {
    member
        .add_role(context, Environment::load()?.ready_role_id)
        .await?;

    log::debug!("Added {} to ready role", member.user.tag());

    Ok(())
}

/// Remove the ready role from a member.
pub async fn remove(member: &mut Member, context: PoiseContext<'_>) -> Result<(), Error> {
    member
        .remove_role(context, Environment::load()?.ready_role_id)
        .await?;

    log::debug!("Removed {} from ready role", member.user.tag());

    Ok(())
}

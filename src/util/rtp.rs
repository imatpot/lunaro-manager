use poise::serenity_prelude::{Context, Member};

use crate::{env::Environment, types::error::Error};

/// Count how many members have the ready role.
pub async fn count(context: &Context) -> Result<usize, Error> {
    let env = Environment::instance();

    let members = context
        .http
        .get_guild_members(env.home_guild_id, None, None)
        .await?;

    let ready_member_count = members
        .iter()
        .filter(|member| {
            member
                .roles
                .iter()
                .any(|role_id| role_id == &env.ready_role_id)
        })
        .count();

    Ok(ready_member_count)
}

/// Add the ready role to a member.
pub async fn add(member: &mut Member, context: &Context) -> Result<(), Error> {
    member
        .add_role(context, Environment::instance().ready_role_id)
        .await?;

    log::debug!("Added {} to ready role", member.user.tag());

    Ok(())
}

/// Remove the ready role from a member.
pub async fn remove(member: &mut Member, context: &Context) -> Result<(), Error> {
    member
        .remove_role(context, Environment::instance().ready_role_id)
        .await?;

    log::debug!("Removed {} from ready role", member.user.tag());

    Ok(())
}

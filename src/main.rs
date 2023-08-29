mod commands;
mod env;
mod events;
mod types;
mod util;

use poise::serenity_prelude::GatewayIntents;
use poise::{Framework, FrameworkOptions};
use std::error::Error;

use crate::env::Environment;
use crate::events::EventHandlers;
use crate::types::poise::PoiseContext;

#[tokio::main]
async fn main() {
    log4rs::init_file("log4rs.yaml", Default::default()).unwrap();

    log::debug!("Loading environment");
    let env = Environment::load();

    log::debug!("Setting up");

    let framework_options = FrameworkOptions {
        pre_command: |context| Box::pin(log_invocation(context)),

        commands: vec![commands::ping::execute()],

        ..Default::default()
    };

    let framework = Framework::builder()
        .token(env.client_token)
        .options(framework_options)
        .intents(GatewayIntents::GUILD_MEMBERS | GatewayIntents::GUILD_PRESENCES)
        .client_settings(|client| client.raw_event_handler(EventHandlers))
        .setup(|context, ready, framework| Box::pin(update_commands(ready, context, framework)));

    log::debug!("Starting");

    match framework.run().await {
        Ok(_) => log::error!("Bot shut down unexpectedly"),
        Err(error) => log::error!("Failed to start: {error}"),
    }
}

/// Log a command's invocation.
async fn log_invocation(context: PoiseContext<'_>) {
    let author = &context.author().tag();
    let command = &context.command().name;
    let guild = &context.partial_guild().await.unwrap().name;

    log::info!("{author} ran [{command}] in {guild}");
}

/// Update the bot's slash commands.
///
/// # Errors
///
/// Panics if the bot is unable to update in any guild.
async fn update_commands(
    ready: &poise::serenity_prelude::Ready,
    context: &poise::serenity_prelude::Context,
    framework: &Framework<(), Box<dyn Error + Send + Sync>>,
) -> Result<(), Box<dyn Error + Send + Sync>> {
    log::debug!("Updating commands");

    if let Ok(guilds) = ready.user.guilds(&context.http).await {
        for guild in guilds {
            poise::builtins::register_in_guild(
                context.http.clone(),
                &framework.options().commands,
                guild.id,
            )
            .await
            .unwrap();
        }
    }

    Ok(())
}

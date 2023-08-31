mod commands;
mod env;
mod errors;
mod events;
mod traits;
mod types;
mod util;

use std::panic;
use std::time::Duration;

use futures::executor::block_on;
use poise::serenity_prelude::{
    Activity, ButtonStyle, Context, CreateActionRow, CreateButton, GatewayIntents, Ready,
};
use poise::{Framework, FrameworkError, FrameworkOptions};
use types::error::Error;
use uuid::Uuid;

use crate::env::Environment;
use crate::events::EventHandlers;
use crate::types::poise::PoiseContext;

#[tokio::main]
async fn main() {
    log4rs::init_file("log4rs.yaml", Default::default()).unwrap();

    // Catch panics and log them
    match panic::catch_unwind(|| block_on(run())) {
        Ok(_) => log::info!("Bot shut down gracefully"),
        Err(_) => log::error!("Bot shut down unexpectedly"),
    }
}

/// Initialize & start the bot.
async fn run() {
    log::debug!("Loading environment");
    let env = match Environment::load() {
        Ok(env) => env,
        Err(error) => {
            log::error!("Failed to load environment: {error}");
            return;
        }
    };

    log::debug!("Setting up");

    let framework_options = FrameworkOptions {
        pre_command: |context| Box::pin(log_invocation(context)),
        on_error: |error| Box::pin(on_framework_error(error)),

        commands: vec![
            commands::ping::run(),
            commands::contribute::run(),
            commands::help::run(),
            commands::tracking::run(),
            commands::rtp::run(),
        ],

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
        Err(error) => log::error!("Bot failed to start: {error}"),
    }
}

/// Log a command's invocation.
async fn log_invocation(context: PoiseContext<'_>) {
    let author = &context.author().tag();
    let guild = &context.partial_guild().await.unwrap().name;
    let parent_commands = context
        .parent_commands()
        .iter()
        .map(|c| &c.name)
        .fold(String::new(), |acc, name| {
            format!("{acc} {name}").trim().to_string()
        });

    let command = if parent_commands.is_empty() {
        context.command().name.to_string()
    } else {
        format!("{} {}", parent_commands, context.command().name)
    };

    log::info!("{author} ran [{command}] in {guild}");
}

/// Create an error message according to the type of error and log it.
async fn on_framework_error(framework_error: FrameworkError<'_, (), Error>) {
    match framework_error {
        FrameworkError::Command { error, ctx } => {
            log_error(&format!("{error:?}: {error}"), ctx).await;
        }
        FrameworkError::CommandPanic { payload, ctx } => match payload {
            Some(payload) => log_error(&payload, ctx).await,
            None => log_error("Generic panic", ctx).await,
        },
        _ => {}
    }
}

/// Log an error and reply with a generic response and a button to show the
/// debug trace.
async fn log_error(message: &str, context: PoiseContext<'_>) {
    let user = &context.author().tag();
    let command = &context.command().name;
    let guild = &context.partial_guild().await.unwrap().name;

    let trace_id = Uuid::new_v4();

    log::error!("{user} ran [{command}] in {guild} and got an error: {message} ({trace_id})",);

    let error_message = "❌  An error occurred while running this command";
    let traced_error_message = format!("{error_message}\n🔍  `{trace_id}`\n\n```{message}```");

    let trace_button = CreateButton::default()
        .custom_id(trace_id)
        .label("Show debug trace")
        .style(ButtonStyle::Secondary)
        .to_owned();

    let action_row = CreateActionRow::default()
        .add_button(trace_button)
        .to_owned();

    let response = context
        .send(|reply| {
            reply
                .ephemeral(true)
                .content(error_message)
                .components(|components| components.add_action_row(action_row))
        })
        .await
        .unwrap();

    match response
        .message()
        .await
        .unwrap()
        .await_component_interaction(context)
        .timeout(Duration::from_secs(60))
        .await
    {
        Some(_) => {
            // Updates the message & removes the button
            response
                .edit(context, |msg| {
                    msg.content(traced_error_message).components(|c| c)
                })
                .await
                .unwrap();
        }
        None => {
            // Removes the button
            response
                .edit(context, |msg| msg.components(|c| c))
                .await
                .unwrap();
        }
    };
}

/// Update the bot's slash commands.
async fn update_commands(
    ready: &Ready,
    context: &Context,
    framework: &Framework<(), Error>,
) -> Result<(), Error> {
    log::debug!("Updating commands");

    if let Ok(guilds) = ready.user.guilds(&context.http).await {
        for guild in guilds {
            poise::builtins::register_in_guild(
                context.http.clone(),
                &framework.options().commands,
                guild.id,
            )
            .await?;
        }
    }

    log::info!("Successfully updated commands");
    context.online().await;
    context.set_activity(Activity::playing("Lunaro")).await;

    Ok(())
}

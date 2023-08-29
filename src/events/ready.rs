use poise::serenity_prelude::{Context, Ready};

pub async fn handle(context: Context, ready: Ready) {
    let bot_tag = ready.user.tag();
    log::info!("{} is ready", bot_tag);
    context.idle().await;
}

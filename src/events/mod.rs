use poise::serenity_prelude::{async_trait, Context, Event, RawEventHandler};

mod presence_update;
mod ready;

pub struct EventHandlers;

#[async_trait]
impl RawEventHandler for EventHandlers {
    async fn raw_event(&self, context: Context, event: Event) {
        match event {
            Event::Ready(e) => {
                ready::handle(context, e.ready).await;
            }
            Event::PresenceUpdate(e) => {
                presence_update::handle(context, e.presence).await;
            }
            _ => (),
        }
    }
}

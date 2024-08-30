use poise::serenity_prelude::{async_trait, Context, Event, RawEventHandler};

mod presence_update;
mod ready;

pub struct EventHandlers;

#[async_trait]
impl RawEventHandler for EventHandlers {
    async fn raw_event(&self, context: Context, raw_event: Event) {
        let handler = match &raw_event {
            Event::Ready(event) => ready::handle(context, &event.ready).await,
            Event::PresenceUpdate(event) => presence_update::handle(context, &event.presence).await,
            _ => Ok(()),
        };

        if let Err(error) = handler {
            log::warn!("Error while handling {:?}: {error:?}: {error}", raw_event);
        }
    }
}

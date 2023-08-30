use poise::serenity_prelude::{async_trait, Context, Event, RawEventHandler};

mod ready;

pub struct EventHandlers;

#[async_trait]
impl RawEventHandler for EventHandlers {
    async fn raw_event(&self, context: Context, event: Event) {
        if let Event::Ready(evt) = event {
            ready::handle(context, evt.ready).await;
        }
    }
}

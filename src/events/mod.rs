use poise::serenity_prelude::{async_trait, Context, Event, RawEventHandler};

mod ready;

pub struct EventHandlers;

#[async_trait]
impl RawEventHandler for EventHandlers {
    async fn raw_event(&self, context: Context, event: Event) {
        if let Event::Ready(ready_event) = event {
            ready::handle(context, ready_event.ready).await;
        }
    }
}

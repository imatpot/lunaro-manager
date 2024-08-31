use poise::{
    serenity_prelude::{Context, FullEvent},
    FrameworkContext,
};

use crate::types::{error::Error, poise::PoiseData};

mod presence_update;
mod ready;

pub async fn event_handler(
    context: &Context,
    event: &FullEvent,
    _framework: FrameworkContext<'_, PoiseData, Error>,
    _data: &PoiseData,
) -> Result<(), Error> {
    let handled_event = match event {
        FullEvent::Ready { data_about_bot } => ready::handle(context, data_about_bot).await,
        FullEvent::PresenceUpdate { new_data } => presence_update::handle(context, new_data).await,
        _ => Ok(()),
    };

    if let Err(error) = handled_event {
        log::error!(
            "Error handling event {}: {:?}",
            event.snake_case_name(),
            error
        );
    }

    Ok(())
}

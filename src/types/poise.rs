use super::error::Error;

pub type PoiseData = ();
pub type PoiseContext<'a> = poise::Context<'a, PoiseData, Error>;

use chrono::{DateTime, Utc};

use super::error::Error;

#[derive(Debug)]
pub struct PoiseData {
    /// The time the bot started. Used for uptime calculation.
    pub started_at: DateTime<Utc>,
}

pub type PoiseContext<'a> = poise::Context<'a, PoiseData, Error>;

use chrono::{DateTime, Utc};

use super::error::Error;

#[derive(Debug)]
pub struct PoiseData {
    pub started_at: DateTime<Utc>,
}

pub type PoiseContext<'a> = poise::Context<'a, PoiseData, Error>;

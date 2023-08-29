pub type Data = ();
pub type Error = Box<dyn std::error::Error + Send + Sync>;
pub type PoiseContext<'a> = poise::Context<'a, Data, Error>;

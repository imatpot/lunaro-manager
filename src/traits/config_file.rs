use async_trait::async_trait;
use futures::lock::MutexGuard;

use crate::types::error::Error;

/// A loadable & savable singleton configuration file.
#[async_trait]
pub trait ConfigFile {
    /// Load from the config file.
    fn load() -> Result<Box<Self>, Error>;

    /// Save to the config file.
    fn save(&self) -> Result<(), Error>;

    /// Returns a reference to a singleton.
    async fn instance<'a>() -> MutexGuard<'a, Self>;
}

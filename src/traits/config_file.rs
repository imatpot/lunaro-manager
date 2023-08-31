use crate::types::error::Error;

/// A loadable & savable configuration file.
pub trait ConfigFile {
    /// Load from the config file.
    fn load() -> Result<Box<Self>, Error>;

    /// Save to the config file.
    fn save(&self) -> Result<(), Error>;
}

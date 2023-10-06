use thiserror::Error;

/// Represents an issue with bot data.
#[derive(Error, Debug)]
pub enum DataError {
    /// The config file is missing.
    #[error("Missing file: {0}")]
    MissingConfigFile(String),
}

use thiserror::Error;

/// Represents an issue with environment variables.
#[derive(Error, Debug)]
pub enum EnvironmentError {
    /// The environment variable is missing.
    #[error("Missing environment variable: {0}")]
    Missing(String),

    /// The environment variable does not match the expected format.
    #[error("Invalid environment variable: {0}")]
    Invalid(String),
}

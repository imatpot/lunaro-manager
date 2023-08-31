use thiserror::Error;

/// Represents an issue with environment variables.
#[derive(Error, Debug)]
pub enum EnvironmentError {
    #[error("Missing environment variable: {0}")]
    Missing(String),

    #[error("Invalid environment variable: {0}")]
    Invalid(String),
}

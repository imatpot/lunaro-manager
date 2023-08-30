use thiserror::Error;

#[derive(Error, Debug)]
/// Represents an issue with environment variables.
pub enum EnvironmentError {
    #[error("Missing environment variable: {0}")]
    Missing(String),

    #[error("Invalid environment variable: {0}")]
    Invalid(String),
}

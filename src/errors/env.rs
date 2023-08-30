use thiserror::Error;

#[derive(Error, Debug)]
pub enum EnvironmentError {
    #[error("Missing environment variable: {0}")]
    MissingEnvironmentVariable(String),

    #[error("Invalid environment variable: {0}")]
    InvalidEnvironmentVariable(String),
}

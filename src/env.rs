use std::env;

use dotenv::dotenv;
use regex::Regex;

use crate::{errors::env::EnvironmentError, types::error::Error};

/// Contains read & validated environment variables.
#[derive(Debug)]
pub struct Environment {
    /// The bot's Discord user ID.
    pub client_id: u64,

    /// Token to connect to the Discord API.
    pub client_token: String,

    /// The guild ID of the guild the bot will be used in.
    pub home_guild_id: u64,

    /// The role ID of the role to be given to users playing Lunaro.
    pub ready_role_id: u64,
}

impl Environment {
    /// Fetches and validates required environment variables and returns them in
    /// an `Environment` struct.
    ///
    /// # Errors
    ///
    /// Errors if an environment variable is missing or in an invalid format.
    pub fn load() -> Result<Environment, Error> {
        dotenv().ok();

        Ok(Environment {
            client_id: get_client_id()?,
            client_token: get_client_token()?,
            home_guild_id: get_home_guild_id()?,
            ready_role_id: get_ready_role_id()?,
        })
    }
}

/// Fetches an environment variable by `name`.
///
/// # Errors
///
/// Errors if the environment variable is missing.
fn read_variable(name: &str) -> Result<String, Error> {
    match env::var(name) {
        Ok(value) => Ok(value),
        Err(_) => Err(EnvironmentError::MissingEnvironmentVariable(name.to_string()).into()),
    }
}

/// Parses a string into a `u64` ID.
///
/// # Errors
///
/// Errors if the string is not a valid ID.
fn parse_id(id_string: &str, name: &str) -> Result<u64, Error> {
    let is_18_digits = Regex::new(r"[0-9]{18}")?;

    if !is_18_digits.is_match(id_string) {
        return Err(EnvironmentError::InvalidEnvironmentVariable(name.to_string()).into());
    }

    let parsing = id_string.parse();

    match parsing {
        Ok(id) => Ok(id),
        Err(_) => Err(EnvironmentError::InvalidEnvironmentVariable(name.to_string()).into()),
    }
}

/// Fetches and validates the client ID environment variable.
///
/// # Errors
///
/// Errors if `CLIENT_ID` is missing or has an invalid format.
fn get_client_id() -> Result<u64, Error> {
    let env_name = "CLIENT_ID";
    let application_id_string = read_variable(env_name)?;

    parse_id(&application_id_string, env_name)
}

/// Fetches and validates the client token environment variable.
///
/// # Errors
///
/// Errors if `CLIENT_TOKEN` is missing or has an invalid format.
fn get_client_token() -> Result<String, Error> {
    let env_name = "CLIENT_TOKEN";
    let client_token = read_variable(env_name)?;

    // FIXME Discord changed their tokens again, so this check no longer works
    // if validate_token(&client_token).is_err() {
    //     return Err(EnvironmentError::InvalidEnvironmentVariable(env_name.to_string()).into());
    // }

    Ok(client_token)
}

/// Fetches and validates the home guild ID environment variable.
///
/// # Errors
///
/// Errors if `HOME_GUILD_ID` is missing or has an invalid format.
fn get_home_guild_id() -> Result<u64, Error> {
    let env_name = "HOME_GUILD_ID";
    let home_guild_id_string = read_variable(env_name)?;

    parse_id(&home_guild_id_string, env_name)
}

/// Fetches and validates the ready role ID environment variable.
///
/// # Errors
///
/// Errors if `READY_ROLE_ID` is missing or has an invalid format.
fn get_ready_role_id() -> Result<u64, Error> {
    let env_name = "READY_ROLE_ID";
    let ready_role_id_string = read_variable(env_name)?;

    parse_id(&ready_role_id_string, env_name)
}

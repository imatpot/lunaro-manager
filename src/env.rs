use std::env;

use dotenv::dotenv;
use poise::serenity_prelude::utils::validate_token;
use regex::Regex;

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
    /// Panics if an environment variable is missing or in an invalid format.
    pub fn load() -> Environment {
        dotenv().ok();

        Environment {
            client_id: get_client_id(),
            client_token: get_client_token(),
            home_guild_id: get_home_guild_id(),
            ready_role_id: get_ready_role_id(),
        }
    }
}

/// Returns an error message for a missing environment variable with a given
/// `name`.
fn missing_variable(name: &str) -> String {
    format!("Missing environment variable {name}")
}

/// Returns an error message for an invalid environment variable with a given
/// `name`.
fn invalid_variable(name: &str) -> String {
    format!("Invalid environment variable {name}")
}

/// Fetches an environment variable by `name`.
///
/// # Errors
///
/// Panics if the environment variable is missing.
fn read_variable(name: &str) -> String {
    env::var(name).unwrap_or_else(|_| panic!("{}", missing_variable(name)))
}

/// Parses a string into a `u64` ID.
///
/// # Errors
///
/// Panics if the string is not a valid ID.
fn parse_id(id_string: &str, name: &str) -> u64 {
    let is_18_digits = Regex::new(r"[0-9]{18}").unwrap();
    if !is_18_digits.is_match(id_string) {
        panic!("{}", invalid_variable(name));
    }

    let id: u64 = id_string
        .parse()
        .unwrap_or_else(|_| panic!("{}", invalid_variable(name)));

    id
}

/// Fetches and validates the client ID environment variable.
///
/// # Errors
///
/// Panics if `CLIENT_ID` is missing or has an invalid format.
fn get_client_id() -> u64 {
    let env_name = "CLIENT_ID";
    let application_id_string = read_variable(env_name);

    parse_id(&application_id_string, env_name)
}

/// Fetches and validates the client token environment variable.
///
/// # Errors
///
/// Panics if `CLIENT_TOKEN` is missing or has an invalid format.
fn get_client_token() -> String {
    let env_name = "CLIENT_TOKEN";
    let discord_token = read_variable(env_name);

    if validate_token(&discord_token).is_err() {
        // FIXME Discord changed their tokens again, so this check no longer works
        // panic!("{}", invalid_variable(env_name));
    }

    discord_token
}

/// Fetches and validates the home guild ID environment variable.
///
/// # Errors
///
/// Panics if `HOME_GUILD_ID` is missing or has an invalid format.
fn get_home_guild_id() -> u64 {
    let env_name = "HOME_GUILD_ID";
    let home_guild_id_string = read_variable(env_name);

    parse_id(&home_guild_id_string, env_name)
}

/// Fetches and validates the ready role ID environment variable.
///
/// # Errors
///
/// Panics if `READY_ROLE_ID` is missing or has an invalid format.
fn get_ready_role_id() -> u64 {
    let env_name = "READY_ROLE_ID";
    let ready_role_id_string = read_variable(env_name);

    parse_id(&ready_role_id_string, env_name)
}

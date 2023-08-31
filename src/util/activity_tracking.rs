use std::collections::HashSet;

use poise::serenity_prelude::User;
use serde::{Deserialize, Serialize};

use crate::{errors::data::DataError, traits::config_file::ConfigFile, types::error::Error};

use super::data;

const CONFIG_FILE: &str = "activity_tracking.json";

/// Configures the activity tracker's behaviour.
#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    /// List of user IDs to ignore activity updates from.
    pub blocklist: HashSet<u64>,
}

impl ConfigFile for Config {
    /// Load the config from the config file.
    fn load() -> Result<Box<Self>, Error> {
        match data::read_config(CONFIG_FILE) {
            Ok(config) => Ok(config),
            Err(error) => match error.downcast_ref::<DataError>() {
                Some(DataError::MissingConfigFile(_)) => {
                    let config = Config {
                        blocklist: HashSet::new(),
                    };
                    config.save()?;
                    Ok(config.into())
                }
                _ => Err(error),
            },
        }
    }

    /// Save the config to the config file.
    fn save(&self) -> Result<(), Error> {
        data::write_config(CONFIG_FILE, self)
    }
}

/// Remove a user from the tracking blocklist, if present.
pub fn allow_for(user: &User) -> Result<(), Error> {
    let mut config = Config::load()?;

    config.blocklist.retain(|id| *id != user.id.0);
    config.save()?;

    log::debug!(
        "Removed {} ({}) from tracking blocklist",
        user.tag(),
        user.id
    );
    Ok(())
}

/// Add a user to the tracking blocklist.
pub fn deny_for(user: &User) -> Result<(), Error> {
    let mut config = Config::load()?;

    config.blocklist.insert(user.id.into());
    config.save()?;

    log::debug!("Added {} ({}) to tracking blocklist", user.tag(), user.id);
    Ok(())
}

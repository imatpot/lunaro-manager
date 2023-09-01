use std::collections::HashSet;

use poise::serenity_prelude::{Presence, User};
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

/// Check if a presence update includes Lunaro activity.
pub fn is_playing_lunaro(presence: &Presence) -> Result<bool, Error> {
    let localized_lunaro = ["lunaro", "лунаро", "루나로"];

    let is_lunaro = presence.activities.iter().any(|activity| {
        if let Some(mission) = &activity.details {
            activity.name.to_lowercase() == "warframe"
                && localized_lunaro.contains(&mission.to_lowercase().as_ref())
        } else {
            false
        }
    });

    // https://github.com/kozabrada123/PyLunaroRPC
    // https://github.com/imatpot/lunaro-manager/pull/1
    let is_py_lunaro_rpc = presence
        .activities
        .iter()
        .any(|activity| activity.name.to_lowercase() == "warframe: lunaro");

    Ok(is_lunaro || is_py_lunaro_rpc)
}

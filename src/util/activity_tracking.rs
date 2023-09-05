use std::{collections::HashSet, sync::OnceLock};

use async_trait::async_trait;
use futures::lock::{Mutex, MutexGuard};
use poise::serenity_prelude::{Presence, User};
use serde::{Deserialize, Serialize};

use crate::{errors::data::DataError, traits::config_file::ConfigFile, types::error::Error};

use super::data;

static CONFIG: OnceLock<Mutex<Config>> = OnceLock::new();
const CONFIG_FILE: &str = "activity_tracking.json";

/// Configures the activity tracker's behaviour.
#[derive(Serialize, Deserialize, Default, Debug)]
pub struct Config {
    /// List of user IDs to ignore activity updates from.
    pub blocklist: HashSet<u64>,
}

impl Config {
    /// Check if a user is on the tracking blocklist.
    pub fn is_blocked(&self, user_id: u64) -> bool {
        self.blocklist.contains(&user_id)
    }

    /// Add a user to the tracking blocklist.
    fn add_to_blocklist(&mut self, user_id: u64) -> Result<(), Error> {
        self.blocklist.insert(user_id);
        self.save()
    }

    /// Remove a user from the tracking blocklist.
    fn remove_from_blocklist(&mut self, user_id: u64) -> Result<(), Error> {
        self.blocklist.remove(&user_id);
        self.save()
    }
}

#[async_trait]
impl ConfigFile for Config {
    fn load() -> Result<Box<Self>, Error> {
        match data::read_config(CONFIG_FILE) {
            Ok(config) => Ok(config),
            Err(error) => match error.downcast_ref::<DataError>() {
                Some(DataError::MissingConfigFile(_)) => {
                    let config = Config::default();
                    config.save()?;
                    Ok(config.into())
                }
                _ => Err(error),
            },
        }
    }

    fn save(&self) -> Result<(), Error> {
        data::write_config(CONFIG_FILE, self)
    }

    async fn instance<'a>() -> MutexGuard<'a, Self> {
        CONFIG
            .get_or_init(|| Mutex::new(*Config::load().unwrap_or_default()))
            .lock()
            .await
    }
}

/// Remove a user from the tracking blocklist, if present.
pub async fn allow_for(user: &User) -> Result<(), Error> {
    let mut config = Config::instance().await;

    config.remove_from_blocklist(user.id.0)?;

    log::debug!(
        "Removed {} ({}) from tracking blocklist",
        user.tag(),
        user.id
    );

    Ok(())
}

/// Add a user to the tracking blocklist.
pub async fn deny_for(user: &User) -> Result<(), Error> {
    let mut config = Config::instance().await;

    config.add_to_blocklist(user.id.0)?;

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

use std::{
    fs::{create_dir_all, File},
    io::{Read, Write},
};

const DATA_DIR: &str = "data";

use serde::{de::DeserializeOwned, Serialize};

use crate::{errors::data::DataError, types::error::Error};

/// Write content to a file in the data directory. If the data directory doesn't
/// exist, it will be created.
fn write_file(path: &str, content: &str) -> std::io::Result<()> {
    create_dir_all(DATA_DIR)?;
    let mut file = File::create(format!("{DATA_DIR}/{}", path))?;

    file.write_all(content.as_bytes())?;

    Ok(())
}

/// Read the contents of a file in the data directory.
fn read_file(path: &str) -> std::io::Result<String> {
    let mut file = File::open(format!("{DATA_DIR}/{}", path))?;
    let mut content = String::new();

    file.read_to_string(&mut content)?;

    Ok(content)
}

/// Write a configuration to a configuration file in the data directory.
pub fn write_config<T: Serialize>(file_name: &str, config: &T) -> Result<(), Error> {
    let content = serde_json::to_string_pretty(config)?;

    match write_file(&file_name, &content) {
        Ok(_) => Ok(()),
        Err(error) => Err(error.into()),
    }
}

/// Read a configuration from a configuration file in the data directory.
pub fn read_config<T: DeserializeOwned>(file_name: &str) -> Result<T, Error> {
    match read_file(&file_name) {
        Ok(content) => {
            let config: T = serde_json::from_str(&content)?;
            Ok(config)
        }
        Err(error) => {
            if error.kind() == std::io::ErrorKind::NotFound {
                Err(DataError::MissingConfigFile(file_name.to_string()).into())
            } else {
                Err(error.into())
            }
        }
    }
}

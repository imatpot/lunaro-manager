mod env;

use crate::env::Environment;

fn main() {
    log4rs::init_file("log4rs.yaml", Default::default()).unwrap();

    log::debug!("Loading environment");
    let env = Environment::load();

    log::debug!("{:?}", env);
}

fn main() {
    log4rs::init_file("log4rs.yaml", Default::default()).unwrap();
    log::info!("Hello, world!");
}

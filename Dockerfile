FROM rust

WORKDIR /mnt/app
COPY . .

RUN cargo install --path .

CMD ["lunaro_manager"]

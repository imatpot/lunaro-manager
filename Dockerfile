FROM rust

WORKDIR /app
COPY . .

RUN cargo install --path .

CMD ["lunaro_manager"]

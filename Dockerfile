FROM rust:1.97-alpine AS builder

RUN apk add --no-cache \
    build-base \
    pkgconf \
    openssl-dev \
    openssl-libs-static

WORKDIR /app
COPY Cargo.toml Cargo.lock log4rs.yaml ./
COPY src ./src/

RUN cargo build --release && \
    chmod +x "target/release/lunaro_manager"

FROM alpine:3 AS final

RUN apk add --no-cache \
    ca-certificates

WORKDIR /app
COPY --from=builder /app/target/release/lunaro_manager /app/log4rs.yaml ./

CMD ["./lunaro_manager"]

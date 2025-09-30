FROM rust:1.90-alpine AS builder

RUN apk add --no-cache \
    build-base=0.5-r3 \
    pkgconf=2.4.3-r0 \
    openssl-dev=3.5.4-r0 \
    openssl-libs-static=3.5.4-r0

WORKDIR /app
COPY Cargo.toml Cargo.lock log4rs.yaml ./
COPY src ./src/

RUN cargo build --release && \
    chmod +x "target/release/lunaro_manager"

FROM alpine:3 AS final

RUN apk add --no-cache \
    ca-certificates=20250619-r0

WORKDIR /app
COPY --from=builder /app/target/release/lunaro_manager /app/log4rs.yaml ./

CMD ["./lunaro_manager"]

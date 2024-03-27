FROM docker.io/library/golang:1.22 AS build-env
WORKDIR /app

ARG COMMIT="2861780b1dcc9ea6d876621ad059cea6dcd77955"

# Fetch and build oasis-core-rosetta-gateway.
RUN git clone https://github.com/everstake/oasis-explorer.git /app &&  \
    git checkout $COMMIT

ENV CGO_ENABLED 0
RUN go build

FROM docker.io/library/alpine:3.19.1
RUN apk add --no-cache ca-certificates
COPY --from=build-env /app/oasisTracker /oasisTracker
COPY --from=build-env app/dao/postgres/migrations /dao/postgres/migrations
COPY --from=build-env app/dao/clickhouse/migrations /dao/clickhouse/migrations

CMD ["/oasisTracker"]

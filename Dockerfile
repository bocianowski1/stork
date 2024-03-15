FROM golang:1.22.0-alpine3.18 AS builder

WORKDIR /app

COPY . .

COPY go.mod go.sum ./
RUN go mod download

RUN CGO_ENABLED=0 GOOS=linux go build -o app

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/app .
COPY --from=builder /app/web/dist ./web/dist

EXPOSE 8080
CMD ["./app"]

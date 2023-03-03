# syntax=docker/dockerfile:1

FROM golang:1.20.1

# Create working directory for receipt API
WORKDIR /app

# Copy our .mod and .sum files into ./app in the Docker image
COPY go.mod ./
COPY go.sum ./

# Move to "receiptstructs" directory and copy the package in there
WORKDIR /app/receiptstructs
COPY . .

# Download all dependencies needed now that the image has our .mod and .sum files
RUN go mod download

# Copy source code into the Docker image
COPY *.go ./

# Compile the Go API application
RUN go build -o /fetch-receipt-api

CMD [ "/fetch-receipt-api" ]
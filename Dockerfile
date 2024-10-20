FROM --platform=linux/amd64 node:22.9.0-bookworm-slim

RUN DEBIAN_FRONTEND=noninteractive apt update \
    &&  DEBIAN_FRONTEND=noninteractive apt install -y curl unzip git

RUN curl -sSL https://github.com/protocolbuffers/protobuf/releases/download/v28.0/protoc-28.0-linux-x86_64.zip -o /tmp/protoc.zip \
    && unzip /tmp/protoc.zip -d /usr/local \
    && rm /tmp/protoc.zip
RUN curl -sSL https://github.com/bufbuild/buf/releases/download/v1.40.1/buf-Linux-x86_64 -o /tmp/buf \
    && chmod +x /tmp/buf \
    && mv /tmp/buf /usr/local/bin/buf

RUN npm install npm@10.8.3 && npm install

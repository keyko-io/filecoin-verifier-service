# initial version from https://github.com/openworklabs/filecoin-docker
# build container stage
FROM golang:1.14.2 AS build-env

# branch or tag of the lotus version to build
ARG BRANCH=fix/remainder-multisig

RUN echo "Building lotus from branch $BRANCH"

RUN apt-get update -y && \
    apt-get install sudo cron curl git mesa-opencl-icd ocl-icd-opencl-dev gcc git bzr jq pkg-config -y

RUN git clone https://github.com/keyko-io/lotus.git --depth 1 --branch $BRANCH && \
    cd lotus && \
    make clean && \
    make 2k lotus-shed && \
    install -C ./lotus /usr/local/bin/lotus && \
    install -C ./lotus-miner /usr/local/bin/lotus-miner && \
    install -C ./lotus-worker /usr/local/bin/lotus-worker && \
    install -C ./lotus-shed /usr/local/bin/lotus-shed && \
    install -C ./lotus-seed /usr/local/bin/lotus-seed

# runtime container stage
FROM ubuntu:18.04

# Instead of running apt-get just copy the certs and binaries that keeps the runtime image nice and small
RUN apt-get update && \
    apt-get install sudo ca-certificates mesa-opencl-icd ocl-icd-opencl-dev tmux jq -y && \
    rm -rf /var/lib/apt/lists/*

COPY --from=build-env /usr/local/bin/lotus /usr/local/bin/lotus
COPY --from=build-env /usr/local/bin/lotus-miner /usr/local/bin/lotus-miner
COPY --from=build-env /usr/local/bin/lotus-worker /usr/local/bin/lotus-worker
COPY --from=build-env /usr/local/bin/lotus-shed /usr/local/bin/lotus-shed
COPY --from=build-env /usr/local/bin/lotus-seed /usr/local/bin/lotus-seed

RUN lotus fetch-params 2048

RUN apt-get update
RUN apt-get -y install curl
RUN curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
RUN apt-get -y install nodejs 
RUN npm i -g yarn 

RUN apt-get -y install git

RUN git clone https://github.com/keyko-io/filecoin-verifier-tools/ --depth 1 --branch master

RUN cd filecoin-verifier-tools/ && \
    yarn

COPY src /filecoin-verifier-service/src
COPY package.json /filecoin-verifier-service/package.json

RUN cd filecoin-verifier-service/ && \
    yarn

COPY e2e-test/entrypoint.bash /bin/entrypoint
COPY e2e-test/rootkey1 /rootkey1
COPY e2e-test/dddd /dddd
COPY e2e-test/setup.sh /bin/setup.sh
COPY e2e-test/run-service.sh /bin/run-service.sh
COPY e2e-test/run-app-service.sh /bin/run-app-service.sh
COPY e2e-test/config.toml /root/config.toml
COPY e2e-test/config-miner.toml /root/config-miner.toml

# API port
EXPOSE 1234

# P2P port
EXPOSE 1235

EXPOSE 2345

EXPOSE 3001

EXPOSE 4001

ENTRYPOINT ["/bin/entrypoint"]

# docker build -f e2e-test/Dockerfile . -t mrsmkl/service:20-10-07
# docker run --rm --name lotus -ti -p 1234:1234 -p 2345:2345 -p 3001:3001 -p 4001:4001 mrsmkl/service:20-10-07

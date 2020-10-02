#!/bin/bash

cd /filecoin-verifier-service

export NODE_TOKEN=$(cat ~/.lotus/token)
export SERVER_HOST=0.0.0.0

yarn run start

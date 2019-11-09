#!/bin/bash

docker rm -f test_1 || true

VERSION=$(cat version)

docker run \
  --rm \
  --network=shared \
  --name test_1 \
  --link local_mongo:db \
  -e MONGO_HOST=db \
  -e MONGO_PORT=27017 \
  -e DB_NAME=dupas \
  -e PORT=3001 \
  -p 3001:3001 \
  kfiku/swarm-test-app:"$VERSION"

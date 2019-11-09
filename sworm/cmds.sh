#!/bin/bash

# DB

docker service create \
  --name mongodb \
  --network shared \
  --publish published=27017,target=27017 \
  --replicas 1 \
  mongo

docker service create \
  --name node_app \
  --network shared \
  --publish published=80,target=80 \
  -e MONGO_HOST=mongodb \
  -e MONGO_PORT=27017 \
  -e DB_NAME=views \
  -e PORT=80 \
  --replicas 10 \
  --mount type=bind,source=/mnt/raid10/server_info,destination=/usr/src/app/src/server_info \
  kfiku/swarm-test-app:0.4

docker service update --image kfiku/swarm-test-app:0.4 node_app

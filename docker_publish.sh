#!/bin/bash

VERSION=$(cat version)
docker push kfiku/swarm-test-app:"$VERSION"

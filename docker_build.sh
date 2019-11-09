#!/bin/bash

VERSION=$(cat version)
docker build -t kfiku/swarm-test-app:"$VERSION" .

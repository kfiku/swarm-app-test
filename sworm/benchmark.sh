#!/bin/bash

curl -s http://node-app.local/clean

autocannon -a 1000 -c 100 http://node-app.local/

wait

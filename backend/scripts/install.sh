#!/bin/bash

npm i --prefix apps/users_service
npm i --prefix apps/catalog_service
npm i --prefix apps/gateway

wait

npm run swagger --prefix apps/gateway
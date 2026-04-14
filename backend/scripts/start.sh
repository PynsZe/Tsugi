#!/bin/bash

npm run build --prefix apps/auth_service &&
npm run build --prefix apps/catalog_service &&
npm run build --prefix apps/gateway

npm start --prefix apps/auth_service &
npm start --prefix apps/catalog_service &
npm start --prefix apps/gateway &

wait
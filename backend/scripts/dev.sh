#!/bin/bash

npm run dev --prefix apps/users_service &
npm run dev --prefix apps/catalog_service &
npm run dev --prefix apps/gateway
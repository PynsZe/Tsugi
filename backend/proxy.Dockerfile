# ---- Base : deps + sources (utilisé par dev et ci) ----
FROM node:22-slim AS base

WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json tsconfig.json ./
COPY packages/ packages/
COPY apps/gateway/ apps/proxy_service/

RUN npm ci --ignore-scripts
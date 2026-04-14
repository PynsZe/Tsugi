# ---- Base : deps + sources (utilisé par dev et ci) ----
FROM node:22-slim AS base

WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json tsconfig.json ./
COPY packages/ packages/
COPY apps/users_service/ apps/users_service/

RUN npm ci --ignore-scripts

# ---- Prod : build + run ----
FROM base AS builder
RUN npm run build --workspace=apps/users_service

FROM node:22-slim AS prod
WORKDIR /app
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/packages/ packages/
COPY --from=builder /app/apps/users_service/package.json apps/users_service/
COPY --from=builder /app/apps/users_service/dist/ apps/users_service/dist/
RUN npm ci --omit=dev
CMD ["node", "apps/users_service/dist/server.js"]
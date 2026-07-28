# =====================================================================
# La Bumanguesa Web — multi-stage build (Angular + nginx)
# =====================================================================

# ---- Etapa 1: build con Node 22 + pnpm ----
FROM node:22-alpine AS build
WORKDIR /app

RUN npm install -g pnpm@11.1.2

# Cachear dependencias: solo se reinstalan si cambia el lockfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN CI=true pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ---- Etapa 2: servir estáticos con nginx ----
FROM nginx:alpine

RUN adduser -D -H -s /sbin/nologin appuser && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appuser /var/run/nginx.pid /var/cache/nginx /var/log/nginx /usr/share/nginx/html

COPY --chown=appuser:appuser nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=appuser:appuser /app/dist/labumanguesa/browser /usr/share/nginx/html

USER appuser

EXPOSE 8080


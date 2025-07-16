# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Production stage
FROM ghcr.io/puppeteer/puppeteer:latest
USER root
WORKDIR /home/pptruser
ENV NODE_ENV=production

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

COPY drizzle.config.js ./
COPY drizzle/ ./drizzle/
COPY --from=builder /app/dist ./dist

RUN chown -R pptruser:pptruser /home/pptruser
USER pptruser

EXPOSE $PORT
CMD ["pnpm", "start"]

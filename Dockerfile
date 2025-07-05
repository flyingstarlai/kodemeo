# Base image with Bun
FROM oven/bun:1.2 AS builder

# Set workdir
WORKDIR /app

# Copy files
COPY . .
COPY .env.production .env

# Install dependencies and build
RUN bun install --frozen-lockfile && \
    bun run build

# Use nginx to serve the static files
FROM nginx:alpine

# Copy build result from Bun
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
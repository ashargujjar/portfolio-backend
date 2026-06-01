# === Stage 1: Build Stage ===
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
# Clean install including devDependencies needed to build TypeScript
RUN npm ci

COPY . .
# Run the build
RUN npm run build

# === Stage 2: Runtime Stage ===
FROM node:20-alpine
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./
# ONLY install production dependencies to save massive amounts of RAM
RUN npm ci --omit=dev

# Copy the built javascript files from the builder stage
COPY --from=builder /app/dist ./dist

# Tell Render/Cloud hosts what port to look for
EXPOSE 3000

CMD ["node", "dist/server.js"]
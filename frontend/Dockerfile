# syntax=docker/dockerfile:1

# Pull latest official node image
FROM node:latest

# Set working directory
WORKDIR /app/frontend

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

#USER node

COPY . .

EXPOSE 5000

# Start the React app
CMD ["npm", "start"]
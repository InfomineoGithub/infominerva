# frontend.Dockerfile
# Use a standard Node base image appropriate for React development
FROM node:18-alpine

WORKDIR /app

# ----------------------------
# FRONTEND SETUP - Only frontend relevant parts
# ----------------------------

# NOTE: The 'apt-get install nodejs npm' part from the original Dockerfile
# is NOT needed here because we are starting FROM a node base image.

# 1) Copy your Tailwind config
COPY tailwind.config.js ./

# 2) Copy package files
COPY package.json package-lock.json* ./

# Install frontend dependencies - Using your exact original command
RUN npm config set strict-ssl false && npm install

# 3) Copy the rest of your React app
COPY ./src    ./src
COPY ./public ./public

# NOTE: The 'COPY .env .env' line from the original Dockerfile is REMOVED.
# Environment variables are injected via 'env_file' in docker-compose.yml,
# which is more secure and flexible than baking the file into the image.

# Expose the frontend port
EXPOSE 3000

# CMD is removed - will be set in docker-compose.yml
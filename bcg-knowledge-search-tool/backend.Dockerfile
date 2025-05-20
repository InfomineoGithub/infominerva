# backend.Dockerfile
# Use the same Python base image as the original
FROM python:3.10-slim

WORKDIR /app

# ----------------------------
# BACKEND SETUP - Only backend relevant parts
# ----------------------------

# Copy backend code FIRST (contains requirements.txt based on original install command)
COPY ./Backend /app/Backend

# Install backend dependencies - Using your exact original command
# Assumes requirements.txt is located at ./Backend/requirements.txt locally
RUN pip install --upgrade pip && \
    pip install -r /app/Backend/requirements.txt

# Expose the backend port
EXPOSE 8000

# CMD is removed - will be set in docker-compose.yml
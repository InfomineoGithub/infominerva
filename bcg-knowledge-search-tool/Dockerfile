# Stage 1: Backend
FROM python:3.10-slim AS backend

WORKDIR /app
COPY ./Backend /app/Backend
WORKDIR /app/Backend
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# Stage 2: Frontend
FROM node:18-alpine AS frontend

WORKDIR /app
COPY tailwind.config.js ./
COPY package.json package-lock.json* ./
RUN npm config set strict-ssl false && npm install --omit=dev # Use --omit=dev for smaller production builds if applicable
COPY ./src ./src
COPY ./public ./public
EXPOSE 3000
CMD ["npm", "start"]
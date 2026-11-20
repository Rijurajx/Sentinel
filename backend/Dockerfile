# SENTINEL Backend — Google Cloud Run Dockerfile
FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8080

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY . .

# Expose default Cloud Run port
EXPOSE 8080

# Start uvicorn ASGI server binding to 0.0.0.0 and Cloud Run dynamic $PORT
CMD exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}

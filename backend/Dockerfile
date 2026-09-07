FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libc-dev libffi-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /app/data

# Render (and most PaaS) inject PORT — default 8001 for local Docker
ENV PORT=8001
EXPOSE 8001

CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT}

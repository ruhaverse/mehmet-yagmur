#!/bin/bash

# Mehmet Yagmur - Backend Services Setup Script
# This script installs dependencies for all backend services

echo "🚀 Installing dependencies for all backend services..."
echo ""

services=(
  "api-gateway"
  "auth-service"
  "user-service"
  "post-service"
  "feed-service"
  "media-service"
  "notification-service"
)

cd "$(dirname "$0")/backend/services"

for service in "${services[@]}"; do
  echo "📦 Installing $service..."
  cd "$service"
  npm install --silent
  if [ $? -eq 0 ]; then
    echo "✅ $service dependencies installed"
  else
    echo "❌ Failed to install $service dependencies"
  fi
  cd ..
  echo ""
done

echo "✅ All backend services dependencies installed!"
echo ""
echo "To start services:"
echo "  - Using Docker: docker-compose up -d"
echo "  - Individual service: cd backend/services/[service-name] && npm start"
echo "  - All services: ./start-all-backend.sh"

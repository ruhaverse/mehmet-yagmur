#!/bin/bash

# Mehmet Yagmur - Start All Backend Services Script
# This script starts all backend microservices in the background

echo "🚀 Starting all backend services..."
echo ""

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICES_DIR="$SCRIPT_DIR/backend/services"

# Check if services directory exists
if [ ! -d "$SERVICES_DIR" ]; then
  echo "❌ Services directory not found: $SERVICES_DIR"
  exit 1
fi

# Array of services
services=(
  "api-gateway:3000"
  "auth-service:3001"
  "user-service:3002"
  "post-service:3003"
  "feed-service:3004"
  "media-service:3005"
  "notification-service:3006"
)

# Start each service
for service_info in "${services[@]}"; do
  IFS=':' read -r service port <<< "$service_info"
  
  echo "📦 Starting $service on port $port..."
  
  # Check if service directory exists
  if [ ! -d "$SERVICES_DIR/$service" ]; then
    echo "⚠️  Service directory not found: $service"
    continue
  fi
  
  # Start the service in background
  cd "$SERVICES_DIR/$service"
  PORT=$port npm start > /tmp/$service.log 2>&1 &
  
  # Store the PID
  echo $! > /tmp/$service.pid
  
  echo "✅ $service started (PID: $!, Port: $port)"
  echo "   Logs: /tmp/$service.log"
  echo ""
done

echo "✅ All services started!"
echo ""
echo "To stop services:"
echo "  kill \$(cat /tmp/*-service.pid /tmp/api-gateway.pid 2>/dev/null)"
echo ""
echo "To view logs:"
echo "  tail -f /tmp/[service-name].log"
echo ""
echo "To check service health:"
echo "  curl http://localhost:3000/health  # API Gateway"
echo "  curl http://localhost:3001/health  # Auth Service"
echo "  # ... etc"
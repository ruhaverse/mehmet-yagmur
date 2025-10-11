#!/bin/bash

# Mehmet Yagmur - Stop All Backend Services Script
# This script stops all running backend microservices

echo "🛑 Stopping all backend services..."
echo ""

# Array of services
services=(
  "api-gateway"
  "auth-service"
  "user-service"
  "post-service"
  "feed-service"
  "media-service"
  "notification-service"
)

stopped=0
not_found=0

# Stop each service
for service in "${services[@]}"; do
  pid_file="/tmp/$service.pid"
  
  if [ -f "$pid_file" ]; then
    pid=$(cat "$pid_file")
    
    # Check if process is running
    if kill -0 $pid 2>/dev/null; then
      kill $pid
      echo "✅ Stopped $service (PID: $pid)"
      rm "$pid_file"
      ((stopped++))
    else
      echo "⚠️  $service was not running (stale PID file)"
      rm "$pid_file"
      ((not_found++))
    fi
  else
    echo "ℹ️  No PID file found for $service"
    ((not_found++))
  fi
done

echo ""
echo "📊 Summary:"
echo "   Stopped: $stopped services"
echo "   Not running: $not_found services"
echo ""

# Clean up log files
if [ "$1" == "--clean-logs" ]; then
  echo "🧹 Cleaning up log files..."
  rm -f /tmp/*-service.log /tmp/api-gateway.log
  echo "✅ Log files cleaned"
fi

echo "✅ Done!"

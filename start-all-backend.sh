#!/bin/bash

# Tüm backend servislerini başlatmak için script

echo "Starting all backend services..."

# API Gateway
cd /workspaces/mehmet-yagmur/backend/services/api-gateway && npm install && npm start &

# Auth Service
cd /workspaces/mehmet-yagmur/backend/services/auth-service && npm install && npm start &

# User Service
cd /workspaces/mehmet-yagmur/backend/services/user-service && npm install && npm start &

# Post Service
cd /workspaces/mehmet-yagmur/backend/services/post-service && npm install && npm start &

# Feed Service
cd /workspaces/mehmet-yagmur/backend/services/feed-service && npm install && npm start &

# Media Service
cd /workspaces/mehmet-yagmur/backend/services/media-service && npm install && npm start &

# Notification Service
cd /workspaces/mehmet-yagmur/backend/services/notification-service && npm install && npm start &

echo "All services started."
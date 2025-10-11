# Mehmet Yagmur - Modern Social Media Platform

## 📱 Overview

Mehmet Yagmur is a modern, production-ready social media platform built with React Native and microservices architecture. The project features a comprehensive mobile application (MehmetYagmurApp) and a scalable backend infrastructure.

## 🏗️ Project Structure

```
mehmet-yagmur/
├── MehmetYagmurApp/           # 📱 Main React Native Application
├── backend/services/          # 🔧 Microservices Backend
│   ├── api-gateway/          # API Gateway (Port 3000)
│   ├── auth-service/         # Authentication Service (Port 3001)
│   ├── user-service/         # User Management (Port 3002)
│   ├── post-service/         # Posts & Content (Port 3003)
│   ├── feed-service/         # Feed Algorithm (Port 3004)
│   ├── media-service/        # Media Storage (Port 3005)
│   └── notification-service/ # Notifications (Port 3006)
├── k8s/                      # ☸️ Kubernetes Configurations
├── .github/workflows/        # 🔄 CI/CD Pipeline
└── dev-guide/               # 📚 Development Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20
- Docker & Docker Compose
- React Native development environment
- PostgreSQL, MongoDB, Redis, Neo4j (via Docker)

### 1. Clone the Repository

```bash
git clone https://github.com/ruhaverse/mehmet-yagmur.git
cd mehmet-yagmur
```

### 2. Setup Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
# Update database URLs, JWT secrets, etc.
```

### 3. Start Backend Services

```bash
# Start all services with Docker Compose
docker-compose up -d

# Or start services individually
cd backend/services/api-gateway && npm install && npm start
cd backend/services/auth-service && npm install && npm start
# ... repeat for other services
```

### 4. Run Mobile Application

```bash
cd MehmetYagmurApp
npm install --legacy-peer-deps

# For Android
npm run android

# For iOS
npm run ios
```

## 🔧 Backend Services

### Service Ports

| Service | Port | Description |
|---------|------|-------------|
| API Gateway | 3000 | Main entry point for all requests |
| Auth Service | 3001 | Authentication & JWT management |
| User Service | 3002 | User profiles & social graph |
| Post Service | 3003 | Content creation & management |
| Feed Service | 3004 | Feed algorithm & caching |
| Media Service | 3005 | File uploads & media storage |
| Notification Service | 3006 | Real-time notifications |

### Database Configuration

- **PostgreSQL**: Structured data (users, posts, auth)
- **MongoDB**: Unstructured content and media metadata
- **Redis**: Caching and session management
- **Neo4j**: Social graph relationships

## 📱 Mobile Application

### Tech Stack

- **React Native 0.81.4** - Modern mobile framework
- **React 19.1.0** - Latest React version
- **TypeScript** - Type-safe development
- **Redux Toolkit** - State management
- **React Navigation 7.x** - Navigation system

### Key Features

- User authentication & profiles
- Social networking (friends, follows)
- Post creation & sharing
- Real-time feed
- Media uploads (photos/videos)
- Notifications
- Group functionality

## 🔄 CI/CD Pipeline

GitHub Actions workflows automatically:
- Build Android APK
- Run tests
- Deploy to production

## 📚 Documentation

- [Complete Setup Guide](dev-guide/COMPLETE_SETUP_GUIDE.md)
- [Troubleshooting Guide](dev-guide/TROUBLESHOOTING_GUIDE.md)
- [Deployment Guide](dev-guide/DEPLOYMENT_GUIDE.md)
- [Integration Plan](ENTEGRASYON_PLANI.md)
- [Cleanup Plan](TEMIZLEME_PLANI.md)

## 🧪 Testing

```bash
# Run tests for MehmetYagmurApp
cd MehmetYagmurApp
npm test

# Backend service tests
cd backend/services/[service-name]
npm test
```

## 🛠️ Development

### ESLint & Prettier

```bash
cd MehmetYagmurApp
npm run lint       # Check code style
npm run lint:fix   # Auto-fix issues
```

### Building for Production

```bash
cd MehmetYagmurApp
npm run build:release
```

## 📦 Dependencies Management

All services use npm for package management. Environment-specific configurations are managed via `.env` files (see `.env.example` templates).

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

### Code Standards

- Follow ESLint/Prettier configurations
- Write meaningful commit messages
- Include tests for new features
- Update documentation as needed

## 📄 License

This project is proprietary software.

## 📞 Contact

For questions or support, please contact the repository maintainers.

## 🎯 Project Status

✅ **Production Ready**
- Modern React Native architecture
- Scalable microservices backend
- Kubernetes deployment ready
- CI/CD pipeline configured
- Comprehensive documentation

## 🔐 Security

- Never commit `.env` files or secrets
- Use environment variables for sensitive data
- Follow security best practices
- Keep dependencies updated
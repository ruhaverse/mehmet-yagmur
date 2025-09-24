# Backend Documentation

## Overview

This document provides an overview of the backend services, database setup, and testing infrastructure for the project.

## Microservices

The backend consists of the following microservices:

1. **Auth Service**: Handles user authentication and authorization.
2. **User Service**: Manages user profiles and related data.
3. **Post Service**: Handles user posts and interactions.
4. **Feed Service**: Generates and serves user feeds.
5. **Media Service**: Manages media uploads and storage.
6. **Notification Service**: Sends notifications to users.

Each service is implemented using Node.js and Express.js.

## Database

The backend uses the following databases:

- **MongoDB**: For storing user data, posts, and other structured data.
- **Redis**: For caching and session management.
- **PostgreSQL**: For relational data storage.
- **Neo4j**: For graph-based data relationships.

## Testing

The backend uses Jest and Supertest for testing. All tests are written in TypeScript and are located in the `test` directory of each service.

### Running Tests

To run the tests, use the following command:

```bash
npx jest
```

Ensure that all services and databases are running before executing the tests.

## Deployment

The backend can be deployed using Docker Compose. Use the following command to start all services:

```bash
./start-all-backend.sh
```

## Contribution Guidelines

- Follow the existing code structure and naming conventions.
- Write tests for all new features and bug fixes.
- Update this documentation as needed.

## Contact

For any questions or issues, please contact the project maintainer.

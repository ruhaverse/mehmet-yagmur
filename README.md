# Mehmet Yagmur Backend Infrastructure

## Overview

This repository contains the backend infrastructure for the Mehmet Yagmur project. It is designed to be modular, scalable, and easy to extend. The current setup includes the following components:

- **PostgreSQL**: For structured data.
- **MongoDB**: For unstructured data like content and media.
- **Redis**: For caching and session management.
- **Neo4j**: For social graph relationships.
- **API Gateway**: To route requests to the appropriate microservices.

## Project Structure

```
mehmet-yagmur/
├── docker-compose.yml       # Docker Compose file to manage services
├── api-gateway/             # API Gateway configuration
│   └── config.json          # Routes for microservices
├── README.md                # Project documentation
└── ... (other microservices and configurations)
```

## Prerequisites

- Docker and Docker Compose installed on your machine.

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/ruhaverse/mehmet-yagmur.git
   cd mehmet-yagmur
   ```

2. Start all services using Docker Compose:

   ```bash
   docker-compose up -d
   ```

3. Verify that all services are running:

   ```bash
   docker ps
   ```

## API Gateway Routes

The API Gateway routes requests to the following microservices:

| Path            | Target Service            |
|-----------------|---------------------------|
| `/auth`         | `auth-service:3001`       |
| `/user`         | `user-service:3002`       |
| `/post`         | `post-service:3003`       |
| `/feed`         | `feed-service:3004`       |
| `/media`        | `media-service:3005`      |
| `/notification` | `notification-service:3006`|

## Future Enhancements

- **Elasticsearch**: For advanced search capabilities.
- **Cassandra**: For distributed data management.
- **InfluxDB**: For time-series data.
- **GraphQL**: To simplify API queries.

## Contribution Guidelines

- Follow the established coding standards.
- Commit only source files; avoid committing `node_modules` or other generated files.
- Use `.env` files for environment-specific configurations.

## Contact

For any questions or issues, please contact the repository maintainer.
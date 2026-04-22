# NestJS Base Setup (Backend Standalone)

This is a premium, production-ready NestJS base setup designed to serve as a robust foundation for various project types.

## Key Features

- **Standardized API Responses**: All successful responses are wrapped in a consistent `{ success, statusCode, message, data }` format.
- **Global Exception Handling**: Refined global filter for uniform error responses.
- **Security**:
  - `helmet` for security headers.
  - `Throttler` for rate limiting (Configurable).
- **Health Checks**: `/api/health` endpoint monitoring Database, Memory, and Disk.
- **Containerization**: Production-ready `Dockerfile` and `docker-compose.yml`.
- **CI/CD**: GitHub Actions workflow for linting and building.
- **Audit Logging**: Middleware for logging POST requests.
- **TypeORM**: Pre-configured with MySQL.

## Prerequisites

- Node.js 20+
- npm
- Docker & Docker Compose (Optional)

## Getting Started

### Installation

```bash
$ npm install
```

### Configuration

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

### Running Locally

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Running with Docker

```bash
$ docker-compose up --build
```

## API Documentation

Swagger UI is available at `http://localhost:3000/api/docs`.

## Health Check

Check system health at `http://localhost:3000/api/health`.

## Project Structure

- `src/kernels`: Core business domains (Auth, User, Admin, etc.).
- `src/utils`: Shared utilities, filters, interceptors, and database configuration.
- `src/main.ts`: Application entry point with security and global configurations.

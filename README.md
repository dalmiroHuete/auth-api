# Sign-Up Flow API

This project is a user registration and authentication API built with NestJS, TypeScript, and PostgreSQL. It follows best practices for architecture, security, and code quality, and is ready for local or production deployment using Docker.

## Main Features

- User registration with validation and secure password storage
- JWT-based authentication
- Input data validation
- Automatic API documentation with Swagger
- PostgreSQL integration via Prisma ORM
- Global error handling and centralized logging
- Clean, scalable architecture (Repository Pattern, clear separation of concerns)
- Ready for unit and integration testing
- Docker support for easy deployment

## Tech Stack

- NestJS (TypeScript)
- PostgreSQL
- Prisma ORM
- JWT and Passport
- bcryptjs for password hashing
- class-validator and class-transformer for validation
- Swagger/OpenAPI for documentation
- Jest for testing
- Docker and docker-compose

## Project Structure

```
src/
├── app.module.ts
├── main.ts
├── commons/
│   ├── dtos/
│   ├── exceptions/
│   ├── guards/
│   └── interfaces/
├── infrastructure/
│   ├── error.filter.ts
│   ├── logger.ts
│   └── prisma.service.ts
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   └── jwt.strategy.ts
│   └── health/
│       ├── health.controller.ts
│       └── health.module.ts
├── repositories/
│   ├── user-repository.interface.ts
│   ├── user.repository.ts
│   
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- PostgreSQL (if running locally)

### Option 1: Using Docker (Recommended)

1. Clone the repository:

```bash
git clone <repository-url>
cd auth-api
```

2. Start the application with Docker:

```bash
docker-compose up --build
```

The API will be available at `http://localhost:3000` and Swagger documentation at `http://localhost:3000/api`.

### Option 2: Local Development

1. Install dependencies:

```bash
yarn install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials and JWT secret.

3. Prepare the database:

```bash
# Generate Prisma client
yarn db:generate

# Apply schema to the database
yarn db:push
```

4. Start the development server:

```bash
yarn start:dev
```

## Main Endpoints

### Authentication

| Method | Endpoint      | Description                | Auth Required |
|--------|--------------|----------------------------|---------------|
| POST   | /auth/signup | Register a new user        | No            |
| POST   | /auth/login  | Login and get JWT token    | No            |

### Health Check

| Method | Endpoint   | Description         | Auth Required |
|--------|------------|---------------------|---------------|
| GET    | /health    | API health check    | No            |

## Usage Example

### Sign Up

**Request:**

```http
POST /auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "clx1234567890abcdef",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Login

**Request:**

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx1234567890abcdef",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

## Security

- **HTTP headers protection:** The API uses Helmet middleware to automatically set secure HTTP headers, protecting against common web vulnerabilities such as XSS, clickjacking, and others. This is applied globally to all routes.
- **Rate limiting:** The backend uses NestJS Throttler to limit each IP address to 10 requests per 60 seconds. This is configured via the `throttlers` array in `ThrottlerModule`:

  ```ts
  ThrottlerModule.forRoot({
    throttlers: [
      {
        ttl: 60,    // time window in seconds
        limit: 10,   // max requests per IP per window
      },
    ],
  })
  ```
  If a client exceeds this limit, the API responds with a `429 Too Many Requests` error. This helps prevent brute-force attacks and abuse of authentication endpoints.
- **Input data validation:** All incoming data is validated using class-validator and class-transformer.
- **JWT authentication:** All protected endpoints require a valid JWT token.
- **CORS:** Cross-Origin Resource Sharing is enabled and configured.
- **SQL injection protection:** Prisma ORM is used for all database access, which prevents SQL injection attacks.

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

## Testing

To run tests:

```bash
yarn test         # Unit tests
yarn test:cov     # Coverage
yarn test:e2e     # End-to-end
yarn test:watch   # Watch mode
```

## Configuration

Main environment variables:

| Variable      | Description                      | Default     |
|-------------- |----------------------------------|-------------|
| DATABASE_URL  | PostgreSQL connection string     | Required    |
| JWT_SECRET    | Secret key for JWT               | Required    |
| PORT          | Server port                      | 3000        |
| NODE_ENV      | Environment (development/production) | development |

## Deployment

### Production

```bash
yarn build
yarn start:prod
```

### Docker

```bash
docker build -t signup-flow-api .
docker run -p 3000:3000 \
  -e DATABASE_URL="<your-db-url>" \
  -e JWT_SECRET="<your-jwt-secret>" \
  signup-flow-api
```

## API Documentation

Swagger documentation is available at `/api` once the server is running.

Includes:
- Available endpoints
- Request/response schemas
- Authentication requirements
- Examples and error codes

## Architecture and Best Practices

- Repository Pattern to decouple business logic and data access
- Global error handling and logging
- Clear separation of layers and responsibilities
- Code ready for testing and scalability

## License

MIT

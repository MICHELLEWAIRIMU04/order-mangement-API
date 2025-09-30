# Order Management API

A scalable REST API for managing customers and orders built with Node.js, TypeScript, Express, PostgreSQL, and Prisma.

## 🏗️ Architecture & Tech Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT tokens
- **Validation:** Zod schemas
- **Documentation:** Swagger/OpenAPI
- **Containerization:** Docker & Docker Compose

## 📁 Project Structure

```
src/
├── controllers/          # Route handlers
├── middleware/           # Auth, validation, error handling
├── services/            # Business logic
├── types/               # TypeScript interfaces
├── utils/               # Helper functions
├── validators/          # Zod schemas
├── routes/              # Express routes
├── config/              # Configuration
└── app.ts              # Express app setup

prisma/
├── schema.prisma        # Database schema
└── migrations/          # Database migrations

docker/
├── Dockerfile
└── docker-compose.yml
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- Docker (optional)

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Environment setup:**
```bash
cp .env
```

3. **Database setup:**
```bash
npx prisma generate
npx prisma migrate dev
```

4. **Start development server:**
```bash
npm run dev
```

The API will be available at `http://localhost:3000`
- Swagger docs: `http://localhost:3000/api-docs`

### Docker Setup (Alternative)

```bash
docker-compose up -d
```

## 📋 Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/order_management"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="24h"

# Server
PORT=3000
NODE_ENV=development

# Default Admin User (for seeding)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
```


## 🔐 API Endpoints

### Authentication
- `POST /api/auth/login` - Login and receive JWT token

### Customers
- `POST /api/customers` - Create a customer
- `GET /api/customers` - List customers (with pagination)
- `GET /api/customers/:id` - Get customer details
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Orders
- `POST /api/orders` - Create an order
- `GET /api/orders` - List orders (with filtering/pagination)
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

## 🔧 Key Features

### Authentication & Authorization
- JWT-based authentication
- Protected routes middleware
- Secure password hashing with bcrypt

### Data Validation
- Zod schemas for request validation
- Comprehensive error handling
- Input sanitization

### Database Design
- Proper foreign key relationships
- Cascade delete for orders when customer is deleted
- Optimized queries with Prisma

### Error Handling
- Centralized error middleware
- Consistent error response format
- Proper HTTP status codes

### API Documentation
- Complete Swagger/OpenAPI documentation
- Interactive API explorer
- Request/response examples

### Performance & Scalability
- Database connection pooling
- Pagination for list endpoints
- Query optimization
- Docker containerization

## 📖 Usage Examples

### Authentication
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}'
```

### Create Customer
```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St, City, State"
  }'
```

### Create Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "customerId": "customer_id_here",
    "total": 99.99,
    "status": "PENDING",
    "notes": "Special delivery instructions"
  }'
```

## 🐳 Docker Commands

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild services
docker-compose up -d --build
```

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Structured logging with winston

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {} // Additional error details
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

## 🔍 Testing

The API includes comprehensive error handling and validation:

- Input validation using Zod schemas
- Authentication middleware for protected routes
- Database constraint validation
- Proper HTTP status codes
- Detailed error messages

## 🚀 Production Deployment

### Environment Setup
1. Set production environment variables
2. Configure database connection
3. Set strong JWT secrets
4. Enable HTTPS
5. Configure logging and monitoring

### Performance Optimizations
- Database connection pooling
- Query optimization with Prisma
- Response caching where appropriate
- Rate limiting for API endpoints


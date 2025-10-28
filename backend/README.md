# SQL Runner Backend (Node.js)

Backend API for SQL Runner application built with Node.js, Express, and SQLite.

## Setup

### Prerequisites
- Node.js 18 or higher
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Initialize database (optional, auto-created on first run):
```bash
npm run init-db
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/verify` - Verify JWT token

### Query Execution
- `POST /api/query/execute` - Execute SQL query (requires auth)
- `GET /api/query/history` - Get query history (requires auth)

### Tables
- `GET /api/tables/` - Get all table names (requires auth)
- `GET /api/tables/:tableName` - Get table schema and sample data (requires auth)

### Health
- `GET /api/health` - Health check

## Environment Variables

Create a `.env` file:
```
PORT=5000
DATABASE_PATH=./sql_runner.db
JWT_SECRET=your-secret-key
JWT_EXPIRE=24h
NODE_ENV=development
```

## Default Users

- Username: `admin`, Password: `admin123`
- Username: `user`, Password: `user123`

## Database

SQLite database with sample tables:
- **Customers** - Customer information
- **Orders** - Order details
- **Shippings** - Shipping status

## Security Features

- JWT authentication
- Query validation (blocks dangerous operations)
- Protected routes
- CORS enabled

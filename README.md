# SQL Runner Application

A full-stack web application for executing SQL queries with **Node.js backend** and **React.js frontend**.

## 🚀 Features

### ✅ Complete Features List

1. **User Authentication**
   - Login and registration system
   - JWT-based authentication
   - Protected API routes
   - Session management

2. **SQL Query Execution**
   - Execute SELECT, INSERT, UPDATE, DELETE queries
   - Real-time query execution
   - Formatted table results with column headers
   - Clear error messages
   - Keyboard shortcut (Ctrl + Enter)

3. **Available Tables Panel**
   - Sidebar showing all database tables
   - View table schema (columns and data types)
   - View sample data (first 5 rows)
   - Interactive table selection

4. **Query History**
   - Track last 20 executed queries
   - View execution timestamps
   - Click to reuse previous queries
   - Per-user query history

5. **Sample Database**
   - Pre-configured SQLite database
   - 3 sample tables: Customers, Orders, Shippings
   - Sample data included

### 🎯 Bonus Features

- ✅ **Authentication System** - Complete JWT implementation
- ✅ **Query History** - Persistent user query history
- ✅ **Dockerization** - Full Docker support with docker-compose

## 🛠️ Technology Stack

### Backend (Node.js)
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite3** - Database
- **JWT** (jsonwebtoken) - Authentication
- **CORS** - Cross-origin support

### Frontend (React.js)
- **React.js 18** - UI framework
- **Axios** - HTTP client
- **CSS3** - Modern styling

## 📋 Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)
- Docker and Docker Compose (optional)

## 🔧 Installation & Setup

### Method 1: Manual Setup (Recommended for Development)

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The backend will start on `http://localhost:5000`

**Note:** The database will be automatically created with sample data on first run.

For development with auto-reload:
```bash
npm run dev
```

#### Frontend Setup

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

### Method 2: Docker Setup (Easiest)

1. Make sure Docker and Docker Compose are installed

2. From the project root directory, run:
```bash
docker-compose up --build
```

This will:
- Build both frontend and backend containers
- Set up networking between services
- Start the application

Access the application at `http://localhost:3000`

To stop:
```bash
docker-compose down
```

## 📖 Usage Guide

### Default Credentials

Pre-configured demo accounts:

- **Admin Account**
  - Username: `admin`
  - Password: `admin123`

- **User Account**
  - Username: `user`
  - Password: `user123`

### Sample SQL Queries

Try these queries:

```sql
-- View all customers
SELECT * FROM Customers;

-- Customers from specific country
SELECT * FROM Customers WHERE country = 'USA';

-- Join customers with orders
SELECT c.first_name, c.last_name, o.item, o.amount
FROM Customers c
JOIN Orders o ON c.customer_id = o.customer_id;

-- Count orders per customer
SELECT c.first_name, COUNT(o.order_id) as total_orders
FROM Customers c
LEFT JOIN Orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id;

-- Shipping status summary
SELECT status, COUNT(*) as count
FROM Shippings
GROUP BY status;

-- Insert new customer
INSERT INTO Customers (first_name, last_name, age, country)
VALUES ('Alice', 'Smith', 27, 'Canada');

-- Update customer
UPDATE Customers SET age = 31 WHERE customer_id = 1;

-- Delete order
DELETE FROM Orders WHERE order_id = 5;
```

### Database Schema

#### Customers Table
| Column | Type | Description |
|--------|------|-------------|
| customer_id | INTEGER | Primary key (auto-increment) |
| first_name | VARCHAR(100) | Customer first name |
| last_name | VARCHAR(100) | Customer last name |
| age | INTEGER | Customer age |
| country | VARCHAR(100) | Customer country |

#### Orders Table
| Column | Type | Description |
|--------|------|-------------|
| order_id | INTEGER | Primary key (auto-increment) |
| item | VARCHAR(100) | Item name |
| amount | INTEGER | Order amount |
| customer_id | INTEGER | Foreign key to Customers |

#### Shippings Table
| Column | Type | Description |
|--------|------|-------------|
| shipping_id | INTEGER | Primary key (auto-increment) |
| status | VARCHAR(100) | Shipping status |
| customer | INTEGER | Customer ID |

## 🏗️ Project Structure

```
sql-runner-app/
├── backend/                     # Node.js Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js     # Database configuration
│   │   ├── middleware/
│   │   │   └── auth.js         # JWT middleware
│   │   ├── routes/
│   │   │   ├── auth.js         # Authentication routes
│   │   │   ├── query.js        # Query execution routes
│   │   │   └── tables.js       # Tables info routes
│   │   ├── utils/
│   │   │   ├── initDb.js       # Database initialization
│   │   │   └── queryValidator.js # Query validation
│   │   └── server.js           # Main server file
│   ├── package.json
│   ├── Dockerfile
│   └── .env
│
├── frontend/                    # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js        # Login/Register component
│   │   │   ├── QueryEditor.js  # Query editor component
│   │   │   └── TablesPanel.js  # Tables sidebar component
│   │   ├── services/
│   │   │   └── api.js          # API service layer
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   ├── Login.css
│   │   │   ├── QueryEditor.css
│   │   │   ├── TablesPanel.css
│   │   │   └── index.css
│   │   ├── App.js              # Main app component
│   │   └── index.js            # Entry point
│   ├── package.json
│   ├── Dockerfile
│   └── .env
│
├── docker-compose.yml          # Docker Compose config
└── README.md                   # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/verify` - Verify JWT token

### Query Execution
- `POST /api/query/execute` - Execute SQL query (protected)
- `GET /api/query/history` - Get query history (protected)

### Tables
- `GET /api/tables/` - Get all table names (protected)
- `GET /api/tables/:tableName` - Get table schema and sample data (protected)

### Health
- `GET /api/health` - Health check endpoint

## 🎨 UI/UX Features

- Modern gradient design
- Responsive layout
- Loading states with visual feedback
- Error handling with clear messages
- Keyboard shortcuts (Ctrl+Enter)
- Interactive hover effects
- Professional color scheme

## 🔒 Security Features

- JWT-based authentication
- Protected API routes
- Query validation (blocks dangerous operations)
- CORS configuration
- Input sanitization
- SQL injection prevention

## ⚠️ Important Notes

1. **Security**: This is a demonstration application. For production:
   - Use bcrypt for password hashing
   - Add rate limiting
   - Use HTTPS
   - Implement comprehensive logging
   - Add input validation middleware

2. **Database**: SQLite is file-based. For production, use PostgreSQL or MySQL.

3. **Query Safety**: The application blocks dangerous queries (DROP, TRUNCATE, etc.) but allows SELECT, INSERT, UPDATE, DELETE.

## 🐛 Troubleshooting

### Backend Issues

**Port 5000 already in use:**
```bash
# Change PORT in backend/.env
PORT=5001
```

**Database errors:**
```bash
# Delete and recreate database
rm backend/sql_runner.db
npm start
```

**Module not found:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

**CORS errors:**
- Ensure backend is running
- Check REACT_APP_API_URL in frontend/.env

**Port 3000 already in use:**
- App will prompt to use different port
- Or kill the process using port 3000

**Module errors:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Docker Issues

**Containers not starting:**
```bash
docker-compose down
docker-compose up --build
```

**Port conflicts:**
- Modify ports in docker-compose.yml

## 📝 Assignment Requirements Checklist

### Core Requirements ✅
- ✅ Frontend built with React.js
- ✅ Backend built with Node.js
- ✅ Query input area with "Run Query" button
- ✅ Results display with tabular data
- ✅ Loading states and error handling
- ✅ Available tables panel in sidebar
- ✅ Table schema preview on click
- ✅ Sample rows display (first 5 rows)
- ✅ RESTful API for query execution
- ✅ API endpoints for table information
- ✅ SQLite database with sample data
- ✅ JSON data format
- ✅ Comprehensive error handling

### Bonus Features ✅
- ✅ User authentication system (JWT)
- ✅ Recent query history (last 20 queries)
- ✅ Complete Dockerization

## 🤝 Support

For issues:
1. Check the troubleshooting section
2. Verify all dependencies are installed
3. Ensure both services are running
4. Check console for error messages

## 📄 License

Educational project for full-stack development assignment.

---

**Built with ❤️ using Node.js, Express, React, and SQLite**

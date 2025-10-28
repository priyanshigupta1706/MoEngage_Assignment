const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const initDatabase = require('./utils/initDb');

// Initialize database if it doesn't exist
const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../sql_runner.db');
if (!fs.existsSync(DB_PATH)) {
  console.log('Initializing database...');
  initDatabase();
}

// Import routes
const authRoutes = require('./routes/auth');
const queryRoutes = require('./routes/query');
const tablesRoutes = require('./routes/tables');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/tables', tablesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'SQL Runner API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'SQL Runner Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      query: '/api/query',
      tables: '/api/tables',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 SQL Runner Backend Server`);
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 http://localhost:${PORT}`);
  console.log(`💾 Database: ${DB_PATH}`);
  console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(50));
});

module.exports = app;

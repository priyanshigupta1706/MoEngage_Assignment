const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../sql_runner.db');

const initDatabase = () => {
  // Check if database already exists
  if (fs.existsSync(DB_PATH)) {
    console.log(`Database ${DB_PATH} already exists.`);
    return;
  }

  const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Error creating database:', err.message);
      return;
    }
    console.log('Creating new database...');
  });

  db.serialize(() => {
    // Create Customers table
    db.run(`
      CREATE TABLE IF NOT EXISTS Customers (
        customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        age INTEGER,
        country VARCHAR(100)
      )
    `, (err) => {
      if (err) console.error('Error creating Customers table:', err.message);
    });

    // Insert sample data into Customers
    const customersStmt = db.prepare(`
      INSERT INTO Customers (first_name, last_name, age, country) VALUES (?, ?, ?, ?)
    `);

    customersStmt.run('John', 'Doe', 30, 'USA');
    customersStmt.run('Robert', 'Luna', 22, 'USA');
    customersStmt.run('David', 'Robinson', 25, 'UK');
    customersStmt.run('John', 'Reinhardt', 22, 'UK');
    customersStmt.run('Betty', 'Doe', 28, 'UAE');
    customersStmt.finalize();

    // Create Orders table
    db.run(`
      CREATE TABLE IF NOT EXISTS Orders (
        order_id INTEGER PRIMARY KEY AUTOINCREMENT,
        item VARCHAR(100),
        amount INTEGER,
        customer_id INTEGER,
        FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
      )
    `, (err) => {
      if (err) console.error('Error creating Orders table:', err.message);
    });

    // Insert sample data into Orders
    const ordersStmt = db.prepare(`
      INSERT INTO Orders (item, amount, customer_id) VALUES (?, ?, ?)
    `);

    ordersStmt.run('Keyboard', 400, 4);
    ordersStmt.run('Mouse', 300, 4);
    ordersStmt.run('Monitor', 12000, 3);
    ordersStmt.run('Keyboard', 400, 1);
    ordersStmt.run('Mousepad', 250, 2);
    ordersStmt.finalize();

    // Create Shippings table
    db.run(`
      CREATE TABLE IF NOT EXISTS Shippings (
        shipping_id INTEGER PRIMARY KEY AUTOINCREMENT,
        status VARCHAR(100),
        customer INTEGER
      )
    `, (err) => {
      if (err) console.error('Error creating Shippings table:', err.message);
    });

    // Insert sample data into Shippings
    const shippingsStmt = db.prepare(`
      INSERT INTO Shippings (status, customer) VALUES (?, ?)
    `);

    shippingsStmt.run('Pending', 2);
    shippingsStmt.run('Pending', 4);
    shippingsStmt.run('Delivered', 3);
    shippingsStmt.run('Pending', 5);
    shippingsStmt.run('Delivered', 1);
    shippingsStmt.finalize();

    // Create users table for authentication
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating users table:', err.message);
    });

    // Insert default users (in production, passwords should be hashed)
    const usersStmt = db.prepare(`
      INSERT INTO users (username, password) VALUES (?, ?)
    `);

    usersStmt.run('admin', 'admin123');
    usersStmt.run('user', 'user123');
    usersStmt.finalize();

    // Create query history table
    db.run(`
      CREATE TABLE IF NOT EXISTS query_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        query TEXT NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `, (err) => {
      if (err) console.error('Error creating query_history table:', err.message);
      else console.log('✅ Database initialized successfully with sample data!');
    });
  });

  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    }
  });
};

// Run if called directly
if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;

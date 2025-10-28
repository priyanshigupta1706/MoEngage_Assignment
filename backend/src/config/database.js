const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../sql_runner.db');

// Create database connection
const getConnection = () => {
  return new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
    }
  });
};

// Run query with promise
const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    const db = getConnection();
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
    db.close();
  });
};

// Run insert/update/delete with promise
const runExec = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    const db = getConnection();
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
    db.close();
  });
};

module.exports = {
  getConnection,
  runQuery,
  runExec,
  DB_PATH
};

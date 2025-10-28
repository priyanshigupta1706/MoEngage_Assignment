const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Get all table names
router.get('/', authenticateToken, (req, res) => {
  const db = getConnection();

  const sql = "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'";

  db.all(sql, [], (err, rows) => {
    db.close();

    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }

    const tables = rows.map(row => row.name);

    res.status(200).json({
      success: true,
      tables: tables
    });
  });
});

// Get table schema and sample data
router.get('/:tableName', authenticateToken, (req, res) => {
  const { tableName } = req.params;

  // Validate table name (alphanumeric and underscore only)
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid table name'
    });
  }

  const db = getConnection();

  // Get table schema
  db.all(`PRAGMA table_info(${tableName})`, [], (err, schemaRows) => {
    if (err) {
      db.close();
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }

    if (schemaRows.length === 0) {
      db.close();
      return res.status(404).json({
        success: false,
        error: `Table '${tableName}' not found`
      });
    }

    const columns = schemaRows.map(row => ({
      name: row.name,
      type: row.type
    }));

    // Get sample data
    db.all(`SELECT * FROM ${tableName} LIMIT 5`, [], (err, dataRows) => {
      db.close();

      if (err) {
        return res.status(400).json({
          success: false,
          error: err.message
        });
      }

      res.status(200).json({
        success: true,
        columns: columns,
        sample_data: dataRows
      });
    });
  });
});

module.exports = router;

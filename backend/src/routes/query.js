const express = require('express');
const router = express.Router();
const { getConnection, runQuery, runExec } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { validateQuery } = require('../utils/queryValidator');

// Execute SQL query
router.post('/execute', authenticateToken, async (req, res) => {
  try {
    const { query } = req.body;
    const userId = req.user.id;

    // Validation
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return res.status(400).json({
        success: false,
        message: 'Query cannot be empty'
      });
    }

    // Validate query for safety
    const validation = validateQuery(trimmedQuery);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // Execute query
    const db = getConnection();

    db.all(trimmedQuery, [], async (err, rows) => {
      if (err) {
        db.close();
        return res.status(400).json({
          success: false,
          error: err.message
        });
      }

      // Get column names if results exist
      let columns = [];
      if (rows.length > 0) {
        columns = Object.keys(rows[0]);
      }

      // Save query to history
      try {
        const historySql = 'INSERT INTO query_history (user_id, query) VALUES (?, ?)';
        await runExec(historySql, [userId, trimmedQuery]);
      } catch (historyErr) {
        console.error('Error saving query history:', historyErr);
      }

      db.close();

      res.status(200).json({
        success: true,
        data: rows,
        columns: columns,
        affected_rows: rows.length
      });
    });

  } catch (error) {
    console.error('Query execution error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during query execution'
    });
  }
});

// Get query history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const sql = `
      SELECT id, query, executed_at 
      FROM query_history 
      WHERE user_id = ? 
      ORDER BY executed_at DESC 
      LIMIT 20
    `;

    const history = await runQuery(sql, [userId]);

    res.status(200).json({
      success: true,
      history: history
    });

  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching query history'
    });
  }
});

module.exports = router;

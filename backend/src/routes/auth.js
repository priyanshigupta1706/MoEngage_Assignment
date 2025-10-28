const express = require('express');
const router = express.Router();
const { runQuery, runExec } = require('../config/database');
const { generateToken, authenticateToken, verifyToken } = require('../middleware/auth');

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    if (!username.trim() || !password.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Username and password cannot be empty'
      });
    }

    // Query database
    const sql = 'SELECT id, username FROM users WHERE username = ? AND password = ?';
    const users = await runQuery(sql, [username.trim(), password]);

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = users[0];

    // Generate JWT token
    const token = generateToken(user.id, user.username);

    res.status(200).json({
      success: true,
      access_token: token,
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      return res.status(400).json({
        success: false,
        message: 'Username and password cannot be empty'
      });
    }

    if (trimmedUsername.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters'
      });
    }

    if (trimmedPassword.length < 4) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 4 characters'
      });
    }

    // Check if username exists
    const checkSql = 'SELECT id FROM users WHERE username = ?';
    const existing = await runQuery(checkSql, [trimmedUsername]);

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Insert new user
    const insertSql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    await runExec(insertSql, [trimmedUsername, trimmedPassword]);

    res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Verify token endpoint
router.get('/verify', authenticateToken, (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        username: req.user.username
      }
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during verification'
    });
  }
});

module.exports = router;

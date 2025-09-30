const express = require('express');
const router = express.Router();

// Use environment variables for security
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'ZenPy2024!'
};

// Admin login endpoint
router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    res.json({ 
      success: true, 
      message: 'Login successful',
      token: 'admin-token-' + Date.now()
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials' 
    });
  }
});

// Authentication middleware
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || !token.startsWith('admin-token-')) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  next();
};

// Get all enquiries (protected)
router.get('/admin/enquiries', authenticateAdmin, (req, res) => {
  const db = require('../database');
  const sql = "SELECT * FROM enquiries ORDER BY created_at DESC";
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

module.exports = router;
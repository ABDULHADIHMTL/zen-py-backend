const express = require('express');
const db = require('../database');
const router = express.Router();

// POST - Save enquiry (Public)
router.post('/', (req, res) => {
  const { name, email, phone, company, message } = req.body;
  
  // Input validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  const sql = `INSERT INTO enquiries (name, email, phone, company, message) 
               VALUES (?, ?, ?, ?, ?)`;
  
  db.run(sql, [name, email, phone || '', company || '', message], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to save enquiry' });
    }
    res.json({ 
      success: true,
      message: 'Enquiry submitted successfully', 
      id: this.lastID 
    });
  });
});

// GET - Retrieve all enquiries (Protected - should be in auth routes)
// COMMENT OUT or REMOVE this route as it's duplicated in auth.js
/*
router.get('/', (req, res) => {
  const sql = "SELECT * FROM enquiries ORDER BY created_at DESC";
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch enquiries' });
    }
    res.json(rows);
  });
});
*/

module.exports = router;
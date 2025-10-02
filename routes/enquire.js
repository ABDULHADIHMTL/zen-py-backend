const express = require('express');
const db = require('../database');
const router = express.Router();

// POST - Save enquiry (handles both form formats)
router.post('/', (req, res) => {
  let { name, firstName, lastName, email, phone, mobile, company, message } = req.body;
  
  // Handle contact form format (firstName + lastName)
  if (firstName && lastName) {
    name = `${firstName} ${lastName}`;
  }
  
  // Handle mobile field from contact form
  if (mobile && !phone) {
    phone = mobile;
  }

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

module.exports = router;
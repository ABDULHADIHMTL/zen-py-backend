const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use environment variable for database path or default
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'enquiries.db');

// Create and connect to database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    // Create table if not exists
    db.run(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        company TEXT,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating table:', err);
      } else {
        console.log('Enquiries table ready');
      }
    });
  }
});

module.exports = db;
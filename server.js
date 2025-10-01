const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const enquireRoutes = require('./routes/enquire');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Improved CORS configuration
app.use(cors({
  origin: [
    'https://zen-py.com',
    'https://www.zen-py.com',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from React build (if exists)
app.use(express.static(path.join(__dirname, '../build')));

// API Routes
app.use('/api/enquire', enquireRoutes);
app.use('/api/auth', authRoutes);

// Handle preflight requests
app.options('*', cors());

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Zen Py Backend Server is running!',
    version: '1.0.0',
    endpoints: {
      enquiry: '/api/enquire',
      auth: '/api/auth'
    }
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Zen Py Server running on port ${PORT}`);
  console.log(`📊 Database: ${process.env.DATABASE_PATH || 'enquiries.db'}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 Admin API: http://localhost:${PORT}/api/auth/admin/login`);
});
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');


const app = express();

// Middleware: CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:9001', // Adjust this to your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
// Middleware: Body Parsing

app.use(express.json());

// Middleware: URL-encoded data parsing
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

// API Routes registration
// auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// user management routes
const userManagementRoutes = require('./routes/userManagement');
app.use('/api/admin', userManagementRoutes);


module.exports = app;
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/connectDB');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// connect to DB
connectDB();

// CORS
app.use(cors({
  origin: 'http://localhost:5173',  // your Vite dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))

// API routes
app.use('/api/factories', require('./routes/factoriesRoutes'));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

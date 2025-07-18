// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Default route for testing in browser
app.get('/', (req, res) => {
  res.send('🚀 Leaderboard backend is running!');
});

// API routes
const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running successfully 🚀');
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

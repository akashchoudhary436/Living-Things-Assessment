const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Allow CORS for frontend

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Initialize SQLite database
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) console.error(err.message);
  console.log('Connected to users database.');
});

// Create users table
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is missing' });
    }
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], async (err) => {
      if (err) return res.status(400).json({ error: 'Username already exists' });

      try {
        // ✅ Correct Django endpoint
        await axios.post('http://localhost:8000/api/register/', {
          username,
          password,
        });
        res.status(201).json({ message: 'User registered successfully and synced with Django' });
      } catch (djangoErr) {
        console.error('Django sync error:', djangoErr.message);
        if (djangoErr.response?.data) {
          console.error(djangoErr.response.data);
        }
        res.status(500).json({ error: 'Failed to sync user with Django' });
      }
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
// Login endpoint (delegates to Django)
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const response = await axios.post('http://localhost:8000/api/login/', {
      username,
      password
    });

    res.json({
      token: response.data.token,
      user_id: response.data.user_id,
      username: response.data.username
    });

  } catch (error) {
    console.error('Django login error:', error.message);
    if (error.response?.data) {
      return res.status(401).json({ error: error.response.data.non_field_errors?.[0] || 'Login failed' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(3000, () => console.log('Node.js server running on port 3000'));

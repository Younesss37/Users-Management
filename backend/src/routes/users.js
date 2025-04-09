const express = require('express');
const { createPool } = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Middleware pour vérifier si l'utilisateur existe
const checkUserExists = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    req.user = rows[0];
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking user', error: error.message });
  }
};

// GET all users
router.get('/', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email FROM users');
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Error getting users' });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email FROM users WHERE id = ?', [req.params.id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(users[0]);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: 'Error getting user' });
  }
});

// POST create user
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const { name, email, password } = req.body;

    // Check if user exists
    const [existingUser] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (existingUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email exists for another user
    const [existingEmail] = await pool.query('SELECT * FROM users WHERE email = ? AND id != ?', [email, userId]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ message: 'Email already exists for another user' });
    }

    await pool.query(
      'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
      [name, email, password, userId]
    );

    res.json({
      id: userId,
      name,
      email,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router; 
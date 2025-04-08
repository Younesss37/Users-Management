const express = require('express');
const router = express.Router();
const pool = require('../config/database');

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
    const [rows] = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// GET single user
router.get('/:id', checkUserExists, async (req, res) => {
  try {
    // L'utilisateur est déjà récupéré par le middleware
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// POST new user
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Vérifier si l'email existe déjà
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
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const { name, email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const [existingUser] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (existingUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Vérifier si l'email existe déjà pour un autre utilisateur
    const [existingEmail] = await pool.query('SELECT * FROM users WHERE email = ? AND id != ?', [email, userId]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ message: 'Email already exists for another user' });
    }

    // Mettre à jour l'utilisateur
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
router.delete('/:id', checkUserExists, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

module.exports = router; 
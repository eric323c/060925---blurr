const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('./db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

router.post('/register', async (req, res) => {
  const { username, password, displayName } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  const hashed = await bcrypt.hash(password, 10);
  const stmt = `INSERT INTO users (username, password, displayName) VALUES (?, ?, ?)`;
  db.run(stmt, [username, hashed, displayName || username], function(err) {
    if (err) {
      console.error('register error', err);
      if (err.code === 'SQLITE_CONSTRAINT') return res.status(409).json({ error: 'username taken' });
      return res.status(500).json({ error: 'db error' });
    }
    const user = { id: this.lastID, username, displayName: displayName || username };
    const token = generateToken({ id: user.id, username: user.username });
    res.json({ token, user });
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  const q = `SELECT id, username, password, displayName, avatar, bio FROM users WHERE username = ?`;
  db.get(q, [username], async (err, row) => {
    if (err) {
      console.error('login db error', err);
      return res.status(500).json({ error: 'db error' });
    }
    if (!row) return res.status(401).json({ error: 'invalid credentials' });

    const ok = await bcrypt.compare(password, row.password);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });

    const user = { id: row.id, username: row.username, displayName: row.displayName, avatar: row.avatar, bio: row.bio };
    const token = generateToken({ id: user.id, username: user.username });
    res.json({ token, user });
  });
});

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'no token' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'malformed token' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'invalid token' });
  }
}

router.get('/me', authMiddleware, (req, res) => {
  const q = `SELECT id, username, displayName, avatar, bio, created_at FROM users WHERE id = ?`;
  db.get(q, [req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ user: row });
  });
});

module.exports = { router, authMiddleware, JWT_SECRET };

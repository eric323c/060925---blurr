const express = require('express');
const router = express.Router();
const { db } = require('./db');

router.get('/', (req, res) => {
  const q = `SELECT id, username, displayName, avatar, bio FROM users LIMIT 20`;
  db.all(q, [], (err, rows) => {
    if(err) return res.status(500).json({ error: 'db error' });
    res.json({ users: rows });
  });
});

module.exports = router;

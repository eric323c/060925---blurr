const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const { db, migrate } = require('./db');
const { router: authRouter, authMiddleware, JWT_SECRET } = require('./auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Wink backend running');
});

// serve uploaded files
app.use('/uploads', express.static(path.resolve(__dirname, '../data/uploads')));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', socket => {
  console.log('user connected', socket.id);

  // join a default room for demo purposes
  socket.join('nearby');

  socket.on('wink', ({ fromId, toId }) => {
    // persist wink in sqlite
    const stmt = `INSERT INTO winks (from_user, to_user) VALUES (?, ?)`;
    db.run(stmt, [fromId || null, toId || null], function(err) {
      if (err) console.error('db insert wink error', err);
      // broadcast wink to room so other clients can update
      io.to('nearby').emit('wink', { fromId, toId });
    });
  });

  socket.on('message', ({ fromId, toId, body }) => {
    const stmt = `INSERT INTO messages (from_user, to_user, body) VALUES (?, ?, ?)`;
    db.run(stmt, [fromId || null, toId || null, body || ''], function(err) {
      if (err) console.error('db insert message error', err);
      io.to('nearby').emit('message', { fromId, toId, body, id: this.lastID });
    });
  });

  socket.on('disconnect', () => console.log('user disconnected', socket.id));
});

// run migrations
migrate();

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

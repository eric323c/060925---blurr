const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Wink backend running');
});

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
    // broadcast wink to room so other clients can update
    io.to('nearby').emit('wink', { fromId, toId });
  });

  socket.on('disconnect', () => console.log('user disconnected', socket.id));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

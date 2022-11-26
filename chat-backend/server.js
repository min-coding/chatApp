const express = require('express');
const app = express();

const rooms = ['finance', 'tech', 'general'];
const cors = require('cors');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const server = require('http').createServer(app);
const PORT = 5000;
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

server.listen(PORT, () => {
  console.log('listening to port', PORT);
});

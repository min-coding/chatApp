const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');

const rooms = ['finance', 'tech', 'general'];
const cors = require('cors');
const User = require('./models/User');
const Message = require('./models/Message');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/users', userRoutes);
require('./connection');

const server = require('http').createServer(app);
const PORT = 5001;
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

app.get('/rooms', (req, res) => {
  res.json(rooms);
});

async function getLastMessagesFromRoom(room) {
  //create a group of messages for each date
  let roomMessages = await Message.aggregate([
    { $match: { to: room } },
    { $group: { _id: '$date', messagesByDate: { $push: '$$ROOT' } } },
  ]);

  return roomMessages;
}

/**
 * default date
 * 02/11/2022
 * we want to compare date, from the latest so we compare from the year->month->day
 *
 * 20221102
 */
function sortRoomMessagesByDate(messages) {
  return messages.sort(function (a, b) {
    let date1 = a._id.split('/');
    let date2 = b._id.split('/');

    date1 = date1[2] + date1[1] + date1[0];
    date2 = date2[2] + date2[1] + date2[0];

    return date1 < date2 ? -1 : 1;
  });
}

//socket connection
io.on('connection', (socket) => {
  // ****** NEW USER *****
  socket.on('new-user', async () => {
    const members = await User.find();

    //broadcast
    io.emit('new-user', members);
  });

  // ****** JOIN ROOM *****
  socket.on('join-room', async (room) => {
    socket.join(room);
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);

    // send to only specific user
    socket.emit('room-messages', roomMessages);
  });

  // ****** GET MESSAGES TO ROOM *****
  socket.on('message-room', async (room, content, sender, time, date) => {
    const newMessage = await Message.create({
      content,
      from: sender,
      time,
      date,
      to: room,
    });
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    // sending message to room
    io.to(room).emit('room-messages', roomMessages);
    socket.broadcast.emit('notifications', room);
  });

});

server.listen(PORT, () => {
  console.log('listening to port', PORT);
});

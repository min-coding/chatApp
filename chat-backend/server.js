const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const path = require('path');

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
    origin: ['http://localhost:3000','https://chatapp-gjpw.onrender.com']  },
});

app.get('/rooms', (req, res) => {
  res.send(rooms);
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
  socket.on('join-room', async (newRoom, previousRooms) => {
    socket.leave(previousRooms);
    socket.join(newRoom);
    let roomMessages = await getLastMessagesFromRoom(newRoom);
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
  
  //logout
  app.delete('/logout', async (req, res) => {
    try {
      const { _id, newMessages } = req.body;
      const user = await User.findById(_id);
      user.status = 'offline';
      user.newMessages = newMessages;
      await user.save();
      
      const members = await User.find();
      socket.broadcast.emit('new-user', members);
      res.status(200).send();
    } catch (error) {
      console.log(e);
      res.status(400).send();
    }
  });
});

const dirname = path.resolve();
app.use(express.static(path.join(dirname, '/chat-frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(dirname, '/chat-frontend/build/index.html'))
);

server.listen(PORT, () => {
  console.log('listening to port', PORT);
});

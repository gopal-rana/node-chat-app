const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publichPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3100;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publichPath));

io.on('connection', (socket) =>{
  console.log('new user connected');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'));

  socket.on('createMessage', (message, callback) =>{
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('This is from the server');
  });

  socket.on('createLocationMessage', (cords) =>{
    io.emit('newLocationMessage', generateLocationMessage('Admin', cords.latitude, cords.longitude));
  })

  socket.on('disconnect', () =>{
    console.log('User was Disconnected');
  });
});

server.listen(port, () =>{
  console.log(`Server is running on port ${port}`);
});

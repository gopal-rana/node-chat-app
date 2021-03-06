const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publichPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3100;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

/*
future enhancements
make chat room name case insensative; --dane
same name is not allowed in same Room --done
show active rooms dropdown list at join page
*/

app.use(express.static(publichPath));

io.on('connection', (socket) =>{
  console.log('new user connected');

  socket.on('join', (params, callback) =>{
    if(!isRealString(params.name) || !isRealString(params.room)){
      callback('Name and Room name are required!');
    }
    var userRoom = params.room.toLowerCase();
    if(users.checkDuplicateUser(params.name, userRoom)){
      callback('User name already taken in this room. Please choose different user name.');
    }

    socket.join(userRoom);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, userRoom);
    io.to(userRoom).emit('updateUserList', users.getUserList(userRoom));

    //socket.leave('The office room');

    //io.emit('messageName')         sends message to every user
    //io.to('The office room').emit('messageName')          Sends message to The office room only

    //socket.broadcast.emit('messageName')   sends the message to every user except self
    //socket.broadcast.to('The office room').emit('messageName')    sends message to every The office room user except self

    //socket.emit('messageName')     sends message to one particular user.

      socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

      socket.broadcast.to(userRoom).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

    callback();
  });
  socket.on('createMessage', (message, callback) =>{
    var user = users.getUser(socket.id);
    if(user && isRealString(message.text)){
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }

    callback('This is from the server');
  });

  socket.on('createLocationMessage', (cords) =>{
    var user = users.getUser(socket.id);
    if(user){
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, cords.latitude, cords.longitude));
    }
  });

  socket.on('disconnect', () => {
      var user = users.removeUser(socket.id);
      if (user) {
        io.to(user.room).emit('updateUserList', users.getUserList(user.room));
        io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
      }
    });
});

server.listen(port, () =>{
  console.log(`Server is running on port ${port}`);
});

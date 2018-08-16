const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publichPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3100;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publichPath));

io.on('connection', (socket) =>{
  console.log('new user connected');

  socket.emit('newMessage', {
    from: 'john@test.com',
    text: 'Hey. What is going on.',
    createdAt: 123
  });

  socket.on('createMessage', function(message){
    console.log('createMessage', message);
  });

  socket.on('disconnect', () =>{
    console.log('User was Disconnected');
  });
});

server.listen(port, () =>{
  console.log(`Server is running on port ${port}`);
});

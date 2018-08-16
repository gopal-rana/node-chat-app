var socket = io();
socket.on('connect', function(){
  console.log('connected to server');

  socket.emit('createMessage', {
    from: 'gopal@test.com',
    text: 'Hey. What is going on.'
  });

});

socket.on('newMessage', function(message){
  console.log('new message', message);
});

socket.on('disconnect', function(){
  console.log('Disconnected from server');
});

var socket = io();
socket.on('connect', function(){
  console.log('connected to server');
});

socket.on('newMessage', function(message){
  console.log('new message', message);
  var li = $('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  $('#messages').append(li);
});

socket.on('newLocationMessage', function(message){
  var li = $('<li></li>');
  var a = $('<a target="_blank">My current location</a>');
  li.text(`${message.from}`);
  a.attr('href', message.url);
  li.append(a);
  $('#messages').append(li);
})

socket.on('disconnect', function(){
  console.log('Disconnected from server');
});

socket.emit('createMessage', {
  from: 'john',
  text: 'Hi'
}, function(data){
  console.log('Got it', data)
});

$('#message-form').on('submit', function(e){
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'User',
    text: $('[name=message]').val()
  }, function(data){
    console.log('Got it', data)
  });
});

var locationButton = $('#send-location');
locationButton.on('click', function(e){
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your borwser');
  }
  locationButton.attr('disabled', 'disabled').text('Sending location...');
  navigator.geolocation.getCurrentPosition(function(position){
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function(){
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location');
  })
});

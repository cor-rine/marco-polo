(function app() {

  var socket = io.connect(CONFIG.host + ":" + CONFIG.port, {reconnect: true});
  var storage = localStorage;
  
  console.log(socket);

  socket.on('connect', function(socket) {
    console.log('Connected!');
    setup();
  });

  function setup() {
    storage.setItem('mp-id', socket.id);
    if (storage.getItem('mp-name')) {
      $('#nameform').remove();
    }
  }

  socket.on('chat message', function(msg){
    var display;
    if (msg.from == storage.getItem('mp-id')) {
      display = "Me: ";
    } else {
      display = msg.displayName + ": ";
    }
    display += msg.message;
    $('#messages').append($('<li>').text(display));
  });

  $('#nameform').submit(function(){
    console.log($('#name').val());
    storage.setItem('mp-name', $('#name').val());
    this.remove();
    return false;
  });

  $('#message').submit(function(){
    socket.emit('chat message', { 'message':$('#m').val(), 'from': storage.getItem('mp-id'), 'displayName': storage.getItem('mp-name') });
    $('#m').val('');
    return false;
  });
})()
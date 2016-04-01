(function app() {

  var socket = io.connect("//" + CONFIG.host + ":" + CONFIG.port, {reconnect: true});
  var storage = localStorage;
  
  console.log(socket);


  function setup() {
    if (!storage.getItem('mp-name')) {
      $('.name-entry').show();
    } else {
      storage.setItem('mp-id', socket.id);
      connectUser();
    }
  }

  function connectUser() {
    // Send user connection
    socket.emit('connect user', {
      'from': storage.getItem('mp-id'),
      'displayName': storage.getItem('mp-name')
    });
    $('.screen-main').removeClass('on');
  }



  // User Connection Event
  socket.on('user connection', function(msg) {
    $('.info').append($('<p>').text('There are ' + msg.clientCount + ' players.'));
    storage.setItem('mp-userCount', msg.clientCount);
    setUI();
  });

  // User Disconnected Event
  socket.on('disconnect user', function(msg) {
    $('.info').append($('<p>').text('There are ' + msg.clientCount + ' players.'));
    storage.setItem('mp-userCount', msg.clientCount);
    gameOver();
  });


  // Receive Message Event
  socket.on('receive message', function(msg){
    var display;
    if (msg.from == storage.getItem('mp-id')) {
      display = "Me: ";
    } else {
      display = msg.displayName + ": ";
    }
    display += msg.message;
    $('#messages').append($('<li>').text(display));
  });


  // Start / Intro
  $('button.start').on('click', function startGame() {
    setup();
    $('.state.intro').hide();
    $('.screen-main').addClass('on');
  });

  // Submit Your Name
  $('#nameform').submit(function(){
    console.log($('#name').val());
    storage.setItem('mp-name', $('#name').val());
    storage.setItem('mp-id', socket.id);
    connectUser();
    setUI();
    $('.name-entry').hide();
    return false;
  });

  function setUI() {
    // Find out if you've been here before
    if (!storage.getItem('mp-id')) {
      $('.screen-main').addClass('on');
      $('.state.intro').show();
    } else {
      // Starting the game
    }

    // Find out if there are enough users
    if (storage.getItem('mp-id') && storage.getItem('mp-userCount') <=2) {
      $('.screen-main').addClass('on');
      $('.state.not-enough-players').show();
    } else {
      $('.state.not-enough-players').hide();
      $('.screen-main').removeClass('on');
      $('.screen.game-board').addClass('on');
    }

  }

  function gameOver() {

  }


  socket.on('connect', function(socket) {
    console.log('Connected!');
    if (!storage.getItem('mp-id')) {
      setUI();
    } else {
      connectUser();
    }
  });

})()
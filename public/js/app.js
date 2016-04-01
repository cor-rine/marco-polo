// (function($) {
//   $.fn.nodoubletapzoom = function() {
//       $(this).bind('touchstart', function preventZoom(e) {
//         var t2 = e.timeStamp
//           , t1 = $(this).data('lastTouch') || t2
//           , dt = t2 - t1
//           , fingers = e.originalEvent.touches.length;
//         $(this).data('lastTouch', t2);
//         if (!dt || dt > 500 || fingers > 1) return; // not double-tap

//         e.preventDefault(); // double tap - prevent the zoom
//         // also synthesize click events we just swallowed up
//         $(this).trigger('click').trigger('click');
//       });
//   };
// })(jQuery);

(function app() {

  var socket = io.connect("//" + CONFIG.host + ":" + CONFIG.port, {reconnect: true});
  var storage = localStorage;
  var board = $('.board');
  var square = $('.square');
  
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
    storage.setItem('mp-userCount', msg.clientCount);
    storage.setItem('mp-users', JSON.stringify(msg.users));
    setUI();
  });

  // User Disconnected Event
  socket.on('user disconnected', function(msg) {
    if (!!storage.getItem('mp-name')) {
      console.log('user disconnected');
      socket.emit('role call', {
        'from': storage.getItem('mp-id'),
        'displayName': storage.getItem('mp-name')
      });
    }
    setUI();
  });


  // Draw a user
  socket.on('drawuser', function(msg){
    var dot;
    if ($('.board #' + msg.from).length != 1) {
      dot = $('<span class="dot" id="' + msg.from + '">');
      board.append(dot);
    }
    dot = $('.board #' + msg.from);

  });


  // Receive Message Event
  socket.on('removeuser', function(msg){
    var dot;
    dot = $('.board #' + msg.from).remove();
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

  // TOUCHSTART
  square.on('mousedown touchstart', function(event) {
    console.log('touched the board', event);

    // board.html('wait for everyone hold on');
    socket.emit('touchstart', {
      'from': storage.getItem('mp-id')
    });

    // $(this).on('mousemove touchmove', function(event) {
    //   console.log('moved the mouse on the board');
    //   socket.emit('touchmove', {
    //     'from': storage.getItem('mp-id'),
    //     'x': event.offsetX,
    //     'y': event.offsetY
    //   });
    // });
  });

  // TOUCHEND
  square.on('mouseup touchend', function(event) {
    event.preventDefault();
    console.log('let go the board');
    // board.html('you let go');
    socket.emit('touchend', {
      'from': storage.getItem('mp-id')
    });
  });

  function setUI() {
    // Find out if you've been here before
    if (!storage.getItem('mp-id')) {
      $('.screen-main').addClass('on');
      $('.state.intro').show();
    } else {
      // Starting the game
      // Find out if there are enough users
      
      var users = JSON.parse(storage.getItem('mp-users'));
      var displayUsers = "";
      _.each(users, function(value, key, list) {
        displayUsers += " " + value.name;
        // $('#users').append($('<li>').html(value.name));
      });

      $('.info').append($('<p>').text(storage.getItem('mp-userCount') + ' people in the room: ' + displayUsers));


      if (storage.getItem('mp-id') && storage.getItem('mp-userCount') <= 1) {
        $('.screen-main').addClass('on');
        $('.state.not-enough-players').show();
        $('.screen.game-board').removeClass('on');
      } else {
        $('.state.not-enough-players').hide();
        $('.screen-main').removeClass('on');
        $('.screen.game-board').addClass('on');    
      }

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
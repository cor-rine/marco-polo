var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
var _ = require('underscore');


var registeredUsers = {};
var haveMarco = false;

app.set('port', (process.env.PORT || 3333));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(req, res){
  res.render('pages/index', {
    'host': req.host,
    'port': app.get('port')
  });
});

app.get('/reset', function(req, res){
  res.render('pages/reset', {
    'host': req.host,
    'port': app.get('port')
  });
});

function chooseMarco() {
  console.log('choosing Marco');

  if (!haveMarco) {

  } else {

  }
}

io.on('connection', function(socket) {

  // Connection listener
  socket.on('connect user', function(msg) {
    console.log('A registered user connected');

    var user = { 
      "id" : msg.from,
      "name" : msg.displayName,
    };
    registeredUsers[msg.from] = user;

    console.log("registeredUsers Size: " + _.size(registeredUsers));
    for (user in registeredUsers) {
      console.log(registeredUsers[user].name);
    }

    // Start game
    if (_.size(registeredUsers) >=3) {
      chooseMarco();
    }

    // registeredUsers[msg.]
    io.emit('user connection', {
      'clientCount': _.size(registeredUsers),
      'users': registeredUsers
    });
  });

  // Role Call listener
  // When a user disconnected, want to re-create the registeredUserList
  socket.on('role call', function(msg) {

    var user = { 
      "id" : msg.from,
      "name" : msg.displayName
    };
    registeredUsers[msg.from] = user;

    console.log("registeredUsers Size: " + _.size(registeredUsers));
    for (user in registeredUsers) {
      console.log(registeredUsers[user].name);
    }

    io.emit('user connection', {
      'clientCount': _.size(registeredUsers), 
      'users': registeredUsers
    });
  });


  // Touchstart
  socket.on('touchstart', function(msg) {
    io.emit('drawuser', msg);
  });

  // Touchmove
  socket.on('touchmove', function(msg) {
    io.emit('drawboard', msg);
  });

  // Touchend
  socket.on('touchend', function(msg) {
    io.emit('removeuser', msg);
  });

  // Disconnect listener
  socket.on('disconnect', function(msg) {
    console.log('A user disconnected');

    registeredUsers = {};
    // console.log(socket.server.engine.clients);
    io.emit('user disconnected');
  });
});


http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



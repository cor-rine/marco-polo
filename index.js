var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
var _ = require('underscore');


var registeredUsers = {};

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

io.on('connection', function(socket) {
  // socket.on('send message', function(msg){
  //   console.log(msg);
  //   io.emit('receive message', msg);
  // });

  // Connection listener
  socket.on('connect user', function(msg) {
    console.log('A registered user connected');

    var user = { 
      "id" : msg.from,
      "name" : msg.displayName
    };
    registeredUsers[msg.from] = user;

    console.log("registeredUsers Size: " + _.size(registeredUsers));
    for (user in registeredUsers) {
      console.log(registeredUsers[user].name);
      console.log('has User: ' + user + ' >> ' + io.sockets.clients().connected);
    }

    // registeredUsers[msg.]
    io.emit('user connection', {
      'clientCount': _.size(registeredUsers),
      'reason': 'connection'
    });
  })

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
      console.log('has User: ' + user + ' >> ' + io.sockets.clients().connected);
    }

    io.emit('user connection', {
      'clientCount': _.size(registeredUsers),
      'reason': 'connection'
    });
  })

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



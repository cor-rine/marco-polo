var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

var registeredUsers = 0;

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
    registeredUsers++;
    io.emit('user connection', {
      'clientCount': registeredUsers,
      'reason': 'connection'
    });
  })

  // Disconnect listener
  socket.on('disconnect', function(msg) {
    console.log('A user disconnected');
    registeredUsers = (registeredUsers >= 1) ? registeredUsers-1 : 0;
    console.log(socket.server.engine.clientsCount);
    // console.log(socket.server.engine.clients);
    io.emit('disconnected', {
      'clientCount': registeredUsers,
      'reason': 'disconnected'
    });
  });
});


http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



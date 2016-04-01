var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

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


  socket.on('send message', function(msg){
    console.log(msg);
    io.emit('receive message', msg);
  });

  // Connection listener
  socket.on('connect user', function(msg) {
    console.log('user connected');
    io.emit('user connection', {
      'clientCount': socket.server.engine.clientsCount,
      'reason': 'connection'
    });
  })

  // Disconnect listener
  socket.on('disconnect', function() {
    console.log('A user disconnected');
    io.emit('user connection', {
      'clientCount': socket.server.engine.clientsCount,
      'reason': 'disconnected'
    });
  });
});


http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



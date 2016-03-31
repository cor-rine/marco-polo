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
  res.set('url', req.url);
  res.render('pages/index');
});

io.on('connection', function(socket) {
  console.log('A user connected');

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });

  // Disconnect listener
  socket.on('disconnect', function() {
      console.log('A user disconnected');
  });
});


http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



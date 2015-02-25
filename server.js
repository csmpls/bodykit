var express = require('express'),
	app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var bodyParser = require('body-parser')

app.use("/public", express.static(__dirname + '/public'))

// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
})

app.post('/', function (req, res) {
  console.log("bitalino data: " + JSON.stringify(req.body))
  io.sockets.emit('bitalino_data', JSON.stringify(req.body))
  res.send('Got a POST request');
})


// connect to client socket
io.on('connection', function (socket) {
  console.log('connected to client socket')
});

// listen
server.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})

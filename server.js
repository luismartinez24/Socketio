var http = require('http');
var fs = require('fs');
var count = 0;

var server = http.createServer(function (req, res){
	fs.readFile('./index.html', function(error, data){
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(data, 'utf-8');
	});
});

var port = Number(process.env.PORT || 3000);
server.listen(port);

console.log('Servidor funcionando en http://127.0.0.1');

var io = require('socket.io').listen(server);


io.sockets.on('connection', function (socket) {
//Server-cliente	
	count++;
	console.log('Usuario conectado. ' + count + ' usuario(s) ahora.');
	socket.emit('users', { number: count});
	socket.broadcast.emit('users', { number: count});
	socket.on('disconnect', function () {
	count--;    
	console.log('Usuario desconectado. ' + count + ' usuario(s) ahora.');
	socket.broadcast.emit('users', { number: count});

  });
//Cliente-server-cliente
	socket.on('message', function (data) {	
	socket.broadcast.emit('enviar mensaje', data);
	
  });
});

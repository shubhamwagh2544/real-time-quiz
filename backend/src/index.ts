import http from 'http';
import {Server} from 'socket.io';

const server = http.createServer();
const io = new Server(server);

io.on('connection', (client) => {
  console.log('socket connection established');

  client.on('event', (data) => {

  });

  client.on('disconnect', () => {

  });
});

io.listen(3000);

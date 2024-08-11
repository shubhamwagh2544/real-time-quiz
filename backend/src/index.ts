import { IoManager } from './managers/IoManager';

const io = IoManager.getIo();

io.on('connection', (client) => {
    console.log('socket connection established');

    client.on('event', (data) => {});

    client.on('disconnect', () => {});
});

io.listen(3000);

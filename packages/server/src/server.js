import express from 'express';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import cors from 'cors';

import path from 'path';
import { Game } from './game';

const production = process.env.NODE_ENV === 'production';

const app = express();
app.use(cors());
app.use(bodyParser.json());

if (production) {
	const build = path.resolve(__dirname, '../../client/build');
	const index = path.join(build, 'index.html');

	app.use(express.static(build));
	app.get('*', (req, res) => res.sendFile(index));
}

const server = app.listen(process.env.PORT || 5000, () => {
	console.log('Server listening on port', server.address().port);
});

const socket = new Server(server, {
	cors: {
		origin: '*',
	},
});

socket.on('connection', (socket) => {
	console.log(`New client connected: ${socket.id}`);
	socket.on('disconnect', () => console.log(`Client disconnected: ${socket.id}`));
});

const game = new Game();

game.start();

setInterval(() => {
	const snapshot = game.snapshot();

	socket.emit('snapshot', snapshot);
}, 1000);

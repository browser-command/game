import express from 'express';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import cors from 'cors';

import path from 'path';
import { fileURLToPath } from 'url';

import { Game } from './game';

const production = process.env.NODE_ENV === 'production';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());

if (production) {
	const client = path.resolve(__dirname, '../../client/build');

	app.use('/client', express.static(client));

	const auth = path.resolve(__dirname, '../../userauth/build');
	app.use('/', express.static(auth));
}

const server = app.listen(production ? 3000 : 5000, () => {
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

const game = new Game(socket);

game.start();

setInterval(() => {
	const snapshot = game.snapshot();

	socket.emit('snapshot', snapshot);
}, 1000 / 30);

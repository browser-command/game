import io from 'socket.io-client';
import { useEffect, useState } from 'react';

/**
 * @function useSocket
 * @returns {import('socket.io-client').Socket}
 */
export const useSocket = () => {
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		const socket = io(`ws://${window.location.hostname}:${5000}`);
		setSocket(socket);
		return () => {
			socket.disconnect();
		};
	}, []);

	return socket;
};

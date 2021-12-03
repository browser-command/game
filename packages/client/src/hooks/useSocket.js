import io from 'socket.io-client';
import { useEffect, useState } from 'react';

/**
 * @function useSocket
 * @returns {import('socket.io-client').Socket}
 */
export const useSocket = () => {
  const [socket, setSocket] = useState(null);

  const production = process.env.NODE_ENV === 'production';

  useEffect(() => {
    const socket = io(
      `ws://${window.location.hostname}:${production ? 3000 : 5000}`
    );
    setSocket(socket);
    return () => {
      socket.disconnect();
    };
  }, [setSocket]);

  return socket;
};

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useSocket } from '../hooks';

export const Network = ({ children }) => {
  const socket = useSocket();

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected');
    });
    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return <>{children}</>;
};

Network.propTypes = {
  children: PropTypes.node,
};

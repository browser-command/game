import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { float, map, model, object, string } from '@browser-command/core';

import { Serializer } from '@browser-command/core';

import { useSocket } from '../hooks';

const serializer = new Serializer();

export const Network = ({ children, enabled = true }) => {
	useEffect(() => {
		console.log(`Network: ${enabled ? 'enabled' : 'disabled'}`);
	}, [enabled]);

	if (!enabled) {
		return <>{children}</>;
	}

	const socket = useSocket();

	const connect = useCallback(() => {
		console.log('connected');
	}, []);

	const disconnect = useCallback(() => {
		console.log('disconnected');
	}, []);

	const message = useCallback((data) => {
		const world = serializer.deserialize(data);

		console.log('snapshot', world);
	}, []);

	useEffect(() => {
		if (!socket) return;

		socket.on('connect', connect);
		socket.on('disconnect', disconnect);

		socket.on('snapshot', message);

		return () => {
			socket.off('connect', connect);
			socket.off('disconnect', disconnect);
			socket.off('snapshot', message);
		};
	}, [socket]);

	return <>{children}</>;
};

Network.propTypes = {
	children: PropTypes.node,
	enabled: PropTypes.bool,
};

export const Position = model('Position', {
	x: float,
	y: float,
});

/**
 * @typedef {{ id: string, components: Map<string, object> }} Entity
 */

export const Entity = model('Entity', {
	id: string,
	components: map(object()),
});

/**
 * @typedef {{ entities: Map<string, Entity> }} World
 */

export const World = model('World', {
	entities: map(Entity),
});

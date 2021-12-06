import React from 'react';
import PropTypes from 'prop-types';
import { useComponentRegistry } from '../hooks';
import { Vector3, boolean } from '@browser-command/core';

export const Movable = ({ moving, target }) => {
	useComponentRegistry('Movable', {
		moving,
		target,
	});

	return <></>;
};

Movable.schema = {
	moving: boolean,
	target: Vector3,
};

Movable.propTypes = {
	moving: PropTypes.bool,
	target: PropTypes.shape({
		x: PropTypes.number,
		y: PropTypes.number,
		z: PropTypes.number,
	}),
};

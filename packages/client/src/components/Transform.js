import React from 'react';
import PropTypes from 'prop-types';

import { Vector3, Quaternion } from '@browser-command/core';

import { useComponentRegistry } from '../hooks';

export const Transform = ({ position, rotation }) => {
	useComponentRegistry('Transform', {
		position,
		rotation,
	});

	return <></>;
};

Transform.schema = {
	position: Vector3,
	rotation: Quaternion,
};

Transform.propTypes = {
	position: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number, z: PropTypes.number }),
	rotation: PropTypes.shape({
		x: PropTypes.number,
		y: PropTypes.number,
		z: PropTypes.number,
		w: PropTypes.number,
	}),
};

import React from 'react';
import PropTypes from 'prop-types';

import { float } from '@browser-command/core';

import { useComponentRegistry } from '../hooks';

export const Position = ({ x, y, z }) => {
	useComponentRegistry('Position', {
		x,
		y,
		z,
	});

	return <></>;
};

Position.schema = {
	x: float,
	y: float,
	z: float,
};

Position.propTypes = {
	x: PropTypes.number,
	y: PropTypes.number,
	z: PropTypes.number,
};

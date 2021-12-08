import React from 'react';
import PropTypes from 'prop-types';

import { object, uint32 } from '@browser-command/core';

import { useComponentRegistry } from '../hooks';

export const Weapon = ({ info, cooldown }) => {
	useComponentRegistry('Weapon', {
		info,
		cooldown,
	});

	return <></>;
};

Weapon.schema = {
	info: object(),
	cooldown: uint32,
};

Weapon.propTypes = {
	info: PropTypes.shape({
		damage: PropTypes.number,
		radius: PropTypes.number,
		cooldown: PropTypes.number,
	}),
	cooldown: PropTypes.number,
};

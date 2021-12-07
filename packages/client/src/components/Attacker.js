import React from 'react';
import PropTypes from 'prop-types';

import { string } from '@browser-command/core';

import { useComponentRegistry } from '../hooks';

export const Attacker = ({ target }) => {
	useComponentRegistry('Attacker', { target });
	return <></>;
};

Attacker.schema = {
	target: string,
};

Attacker.propTypes = {
	target: PropTypes.string,
};

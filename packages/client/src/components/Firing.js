import React from 'react';
import { useComponentRegistry } from '../hooks';
import PropTypes from 'prop-types';
import { string } from '@browser-command/core';

export const Firing = ({ victim }) => {
	useComponentRegistry('Firing', { victim });
	return <></>;
};

Firing.schema = {
	victim: string,
};

Firing.propTypes = {
	victim: PropTypes.string,
};

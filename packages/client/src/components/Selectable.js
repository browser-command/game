import React from 'react';
import PropTypes from 'prop-types';
import { useComponentRegistry } from '../hooks';
import { bool } from '@browser-command/core';

export const Selectable = ({ selected }) => {
	useComponentRegistry('Selectable', { selected });

	return <></>;
};

Selectable.schema = {
	selected: bool,
};

Selectable.propTypes = {
	selected: PropTypes.bool,
};

import React from 'react';
import PropTypes from 'prop-types';

import { Entity, Model } from '../components';

export const Unit = () => {
	return (
		<Entity>
			<Model src="/models/m1-ship1.obj" />
		</Entity>
	);
};

Unit.propTypes = {
	model: PropTypes.string,
};

import React from 'react';
import PropTypes from 'prop-types';

import { int32 } from '@browser-command/core';
import { Html } from '@react-three/drei';
import { useComponentRegistry } from '../hooks';

export const Health = ({ health }) => {
	useComponentRegistry('Health', { health });

	return (
		<Html distanceFactor={100} center style={{ top: -60 }}>
			<progress value={health / 100} />
		</Html>
	);
};

Health.schema = {
	health: int32,
};

Health.propTypes = {
	health: PropTypes.number.isRequired,
};

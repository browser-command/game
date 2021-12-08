import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ProgressBar from '@ramonak/react-progress-bar';

import { int32 } from '@browser-command/core';
import { Html } from '@react-three/drei';
import { useComponentRegistry, useEntity } from '../hooks';

export const Health = ({ health }) => {
	useComponentRegistry('Health', { health });

	const { components } = useEntity();

	const color = useMemo(() => {
		const weapon = components.get('Weapon');

		if (weapon) {
			const { color } = weapon.info;
			return color || 'blue';
		}

		return 'blue';
	});

	return (
		<Html distanceFactor={100} center style={{ top: -60 }}>
			<ProgressBar
				completed={health}
				customLabel={' '}
				width={'150px'}
				height={'10px'}
				bgColor={color}
			/>
		</Html>
	);
};

Health.schema = {
	health: int32,
};

Health.propTypes = {
	health: PropTypes.number.isRequired,
};

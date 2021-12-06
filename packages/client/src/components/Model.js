import React, { Suspense, useState } from 'react';
import PropTypes from 'prop-types';

import { string } from '@browser-command/core';

import { useComponentRegistry, useEntity, useOBJ } from '../hooks';
import { useFrame } from '@react-three/fiber';

export const Model = ({ src }) => {
	const { components } = useEntity();

	const [position, setPosition] = useState([0, 0, 0]);

	useFrame(() => {
		const position = components.get('Position');
		if (position) {
			setPosition([position.x, position.y, position.z]);
		}
	});

	useComponentRegistry('model', {
		src,
	});

	return (
		<Suspense fallback={null}>
			<ModelInternal src={src} position={position} />
		</Suspense>
	);
};

Model.schema = {
	src: string,
};

Model.propTypes = {
	src: PropTypes.string.isRequired,
};

const ModelInternal = ({ src, position = [0, 0, 0] }) => {
	const object = useOBJ(src);

	return <primitive object={object} position={position} />;
};

ModelInternal.displayName = 'ModelInternal';

ModelInternal.propTypes = {
	src: PropTypes.string.isRequired,
	position: PropTypes.arrayOf(PropTypes.number),
};

import React, { Suspense } from 'react';
import PropTypes from 'prop-types';

import { useComponentRegistry, useOBJ } from '../hooks';
import { useGameStore } from '../stores';

export const Model = ({ src }) => {
	useComponentRegistry('model', {});

	return (
		<Suspense fallback={null}>
			<ModelInternal src={src} />
		</Suspense>
	);
};

useGameStore.getState().components.register('model', Model);

Model.propTypes = {
	src: PropTypes.string.isRequired,
};

const ModelInternal = ({ src }) => {
	const object = useOBJ(src);

	return <primitive object={object} />;
};

ModelInternal.displayName = 'ModelInternal';

ModelInternal.propTypes = {
	src: PropTypes.string.isRequired,
};

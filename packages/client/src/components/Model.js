import React, { Suspense } from 'react';
import PropTypes from 'prop-types';

import { useLoader } from '@react-three/fiber';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import { useComponentRegistry } from '../hooks';
import { Box } from '@react-three/drei';
import { useGameStore } from '../stores';
import { ErrorBoundary } from 'react-error-boundary';

export const Model = ({ src }) => {
	useComponentRegistry('model', {});

	return (
		<ErrorBoundary fallback={<Box />}>
			<Suspense fallback={<Box />}>
				<ModelInternal src={src} />;
			</Suspense>
		</ErrorBoundary>
	);
};

useGameStore.getState().components.register('model', Model);

Model.propTypes = {
	src: PropTypes.string.isRequired,
};

const ModelInternal = ({ src }) => {
	const object = useLoader(OBJLoader, src);

	console.log(object);

	return <primitive object={object} />;
};

ModelInternal.displayName = 'ModelInternal';

ModelInternal.propTypes = {
	src: PropTypes.string.isRequired,
};

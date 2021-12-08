import React, { Suspense, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { string } from '@browser-command/core';

import { useComponentRegistry, useOBJ } from '../hooks';

export const Model = ({ src }) => {
	useComponentRegistry('Model', {
		src,
	});

	return (
		<Suspense fallback={null}>
			<ModelInternal src={src} />
		</Suspense>
	);
};

Model.schema = {
	src: string,
};

Model.propTypes = {
	src: PropTypes.string.isRequired,
};

const ModelInternal = ({ src }) => {
	const obj = useOBJ(src);

	const [object, setObject] = useState(null);

	useEffect(() => {
		if (!obj) {
			return;
		}

		setObject(() => obj.clone());
	}, [obj]);

	return object && <primitive scale={[0.3, 0.3, 0.3]} object={object} />;
};

ModelInternal.displayName = 'ModelInternal';

ModelInternal.propTypes = {
	src: PropTypes.string.isRequired,
};

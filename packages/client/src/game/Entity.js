import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { EntityContext } from '../hooks';

export const Entity = ({ children, id }) => {
	const ref = useRef(null);
	const [registry] = useState(new Map());

	const components = useMemo(
		() => ({
			register: (id, component) => registry.set(id, component),
			unregister: (id) => registry.delete(id),
			get: (id) => registry.get(id),
		}),
		[registry]
	);

	const context = useMemo(
		() => ({
			components,
			id,
		}),
		[components, id]
	);

	return (
		<EntityContext.Provider value={context}>
			<group ref={ref}>{children}</group>
		</EntityContext.Provider>
	);
};

Entity.propTypes = {
	children: PropTypes.node,
	id: PropTypes.string,
};

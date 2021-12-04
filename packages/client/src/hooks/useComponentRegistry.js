import { useLayoutEffect } from 'react';

import { useEntity } from './useEntity';

export const useComponentRegistry = (name, component) => {
	const { components } = useEntity();

	useLayoutEffect(() => {
		components.register(name, component);
	});

	useLayoutEffect(() => {
		return () => components.unregister(name);
	}, [components, name]);

	return component;
};

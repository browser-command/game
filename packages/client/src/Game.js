import React from 'react';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';

import { Entity, Selection } from './components';
import { useGameStore } from './stores';
import { Space } from './scenes';

export const Game = () => {
	const entities = useGameStore((state) => state.entities);
	const registry = useGameStore((state) => state.components);

	return (
		<Canvas camera={{ position: [-20, 20, -20], fov: 75 }}>
			<Stats />
			<Space />
			<Selection>
				{entities.map(({ id, components, ...props }) => (
					<Entity key={id} {...props}>
						{components.map(({ id, ...props }) => {
							const Component = registry.get(id);
							return <Component key={id} {...props} />;
						})}
					</Entity>
				))}
			</Selection>
			<OrbitControls />
		</Canvas>
	);
};

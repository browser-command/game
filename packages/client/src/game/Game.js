import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';

import { Entity } from './Entity';
import { Selection } from './Selection';
import { useGameStore } from '../stores';

export const Game = ({ children, components }) => {
	const entities = useGameStore((state) => [...state.entities.values()]);
	const registered = useGameStore((state) => state.components);
	const register = useGameStore((state) => state.registerComponent);

	useEffect(() => {
		for (const [id, component] of Object.entries(components)) {
			register(id, component);
		}
	}, [register, components]);

	return (
		<Canvas mode="concurrent" camera={{ position: [-20, 20, -20], fov: 75 }}>
			<Stats />
			{children}
			<Selection>
				{entities.map(({ id, components, ...props }) => (
					<Entity key={id} {...props}>
						{[...components.values()].map(({ $id, ...props }) => {
							const Component = registered[$id];
							return Component ? <Component key={$id} {...props} /> : null;
						})}
					</Entity>
				))}
			</Selection>
			<OrbitControls />
		</Canvas>
	);
};

Game.propTypes = {
	children: PropTypes.node,
	components: PropTypes.objectOf(PropTypes.object),
};

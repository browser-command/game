import React from 'react';
import PropTypes from 'prop-types';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';

import { Entity } from './Entity';
import { Selection } from './Selection';
import { useGameStore } from '../stores';

export const Game = ({ children }) => {
	const entities = useGameStore((state) => state.entities);
	const registry = useGameStore((state) => state.components);

	return (
		<Canvas mode="concurrent" camera={{ position: [-20, 20, -20], fov: 75 }}>
			<Stats />
			{children}
			<Selection>
				{entities.map(({ id, components, ...props }) => (
					<Entity key={id} {...props}>
						{components.map(({ $id, ...props }) => {
							if (!registry.get($id)) {
								return null;
							}
							const Component = registry.get($id);
							return <Component key={$id} {...props} />;
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
};

import React from 'react';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Stats } from '@react-three/drei';

import { Particles } from './entities';
import { Entity, Selection } from './components';
import { useGameStore } from './stores';

export const Game = () => {
	const entities = useGameStore((state) => state.entities);
	const registry = useGameStore((state) => state.components);

	return (
		<Canvas camera={{ position: [-20, 20, -20], fov: 75 }}>
			<Stats />
			<color attach={'background'} args={['#020209']} />
			<fog attach="fog" args={['#070710', 100, 700]} />
			<ambientLight intensity={0.5} />
			<gridHelper args={[100, 10]}>
				<lineBasicMaterial attach="material" color="#303030" />
			</gridHelper>
			<Stars />
			<Particles />
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

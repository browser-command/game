import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Canvas } from '@react-three/fiber';
import { Box, OrbitControls, Stars, Stats } from '@react-three/drei';

import { Particles, Unit } from './entities';
import { Selection } from './components';

export const Game = () => {
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
				<ErrorBoundary FallbackComponent={Box}>
					<Unit position={[0, 0, 0]} />
				</ErrorBoundary>
			</Selection>
			<OrbitControls />
		</Canvas>
	);
};

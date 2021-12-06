import React, { Suspense } from 'react';

import { Stars } from '@react-three/drei';

import { Particles } from './Particles';
import { Star } from './Star';

export const Space = () => {
	return (
		<>
			<color attach={'background'} args={['#000002']} />
			<fog attach="fog" args={['#070710', 100, 700]} />
			<ambientLight intensity={0.25} />
			<gridHelper args={[100, 10]}>
				<lineBasicMaterial attach="material" color="#303030" />
			</gridHelper>
			<Stars />
			<Star />
			<Particles />
			<Suspense fallback={null}>
				<Star />
			</Suspense>
		</>
	);
};

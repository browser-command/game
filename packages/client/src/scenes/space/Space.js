import React from 'react';

import { Stars } from '@react-three/drei';
import { Particles } from './Particles';

export const Space = () => {
	return (
		<>
			<color attach={'background'} args={['#020209']} />
			<fog attach="fog" args={['#070710', 100, 700]} />
			<ambientLight intensity={0.5} />
			<gridHelper args={[100, 10]}>
				<lineBasicMaterial attach="material" color="#303030" />
			</gridHelper>
			<Stars />
			<Particles />
		</>
	);
};

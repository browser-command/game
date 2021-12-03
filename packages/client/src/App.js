import React from 'react';

import { Canvas } from '@react-three/fiber';

import './index.css';
import { Unit } from './entities';
import { OrbitControls, Stars } from '@react-three/drei';

function App() {
	return (
		<div>
			<Canvas>
				<color attach={'background'} args={['#020209']} />
				<fog attach="fog" args={['#070710', 100, 700]} />
				<ambientLight intensity={0.25} />
				<OrbitControls />
				<Stars />
				<Unit position={[0, 0, 0]} />
			</Canvas>
		</div>
	);
}

export default App;

import React from 'react';

import { Canvas } from '@react-three/fiber';

import './index.css';
import { Selection } from './components';
import { Unit, Particles } from './entities';
import { OrbitControls, Stars, Stats } from '@react-three/drei';

function App() {
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
				<Unit position={[0, 0, 0]} />
			</Selection>
			<OrbitControls />
		</Canvas>
	);
}

export default App;

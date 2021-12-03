import React from 'react';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';

import './index.css';
import { Stars } from './entities';

function App() {
	return (
		<div>
			<Canvas
				linear
				mode={'concurrent'}
				camera={{ position: [0, 0, 2000], near: 0.01, far: 10000, fov: 45 }}
				onCreated={({ gl }) => {
					gl.setClearColor(new THREE.Color('#020209'));
				}}
			>
				<fog attach="fog" args={['#070710', 100, 700]} />
				<ambientLight intensity={0.25} />
				<Stars />
			</Canvas>
		</div>
	);
}

export default App;

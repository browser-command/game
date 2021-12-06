import { useFrame, useLoader } from '@react-three/fiber';
import React, { useState } from 'react';

import { TextureLoader } from 'three';

import './StarMaterial';

export const Star = () => {
	const [time, setTime] = useState(0);
	const [texture] = useLoader(TextureLoader, ['/materials/star.jpg']);

	useFrame(() => {
		setTime((t) => t + 0.1);
	});

	return (
		<mesh>
			<sphereBufferGeometry attach="geometry" args={[4, 32, 32]} />
			<starMaterial attach="material" time={time} texture={texture} />
		</mesh>
	);
};

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export const Star = () => {
	const ref = useRef();

	const [time, setTime] = React.useState(0);

	useFrame(() => {
		setTime((t) => t + 0.01);
	});

	return (
		<group ref={ref}>
			<mesh position={[0, 0, 0]}>
				<sphereBufferGeometry args={[4, 32, 32]} />
				<starMaterial time={time} />
			</mesh>
		</group>
	);
};

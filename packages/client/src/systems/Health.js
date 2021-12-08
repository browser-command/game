import React, { useEffect, useCallback, useState, useRef, useMemo } from 'react';
import useSound from 'use-sound';
import { useFrame } from '@react-three/fiber';

import { useSocket } from '../hooks';
import { Object3D, Vector3 } from 'three';

export const Health = () => {
	const socket = useSocket();

	const [explosions, setExplosions] = useState([]);

	const [play] = useSound('sounds/explosion2.wav');

	useFrame(() => {
		setExplosions((explosions) =>
			explosions.filter((explosion) => explosion.time + 1000 > Date.now())
		);
	});

	const death = useCallback(({ position: { x, y, z } }) => {
		setExplosions((explosions) => [...explosions, { position: [x, y, z], time: Date.now() }]);
		play();
	}, []);

	useEffect(() => {
		if (!socket) return;

		console.log('Listening to death');
		socket.on('death', death);

		return () => {
			socket.off('death', death);
		};
	}, [socket]);

	return (
		<group>
			{explosions.map(({ position }, index) => (
				<Explosion position={position} key={index} />
			))}
		</group>
	);
};

const dummy = new Object3D();

const Explosion = ({ position }) => {
	const group = useRef();
	const particles = useMemo(() => [make('white', 0.8), make('orange', 0.6)], []);

	useFrame(() => {
		particles.forEach(({ data }, type) => {
			const mesh = group.current.children[type];
			data.forEach(([vec, normal], i) => {
				vec.add(normal);
				dummy.position.copy(vec);
				dummy.updateMatrix();
				mesh.setMatrixAt(i, dummy.matrix);
			});
			mesh.material.opacity -= 0.025;
			mesh.instanceMatrix.needsUpdate = true;
		});
	});

	return (
		<group ref={group} position={position} scale={[0.5, 0.5, 0.5]}>
			{particles.map(({ color, data }, index) => (
				<instancedMesh key={index} args={[null, null, data.length]} frustumCulled={false}>
					<dodecahedronGeometry args={[10, 0]} />
					<meshBasicMaterial color={color} transparent opacity={1} fog={false} />
				</instancedMesh>
			))}
		</group>
	);
};

function make(color, speed) {
	return {
		ref: React.createRef(),
		color,
		data: new Array(20)
			.fill()
			.map(() => [
				new Vector3(),
				new Vector3(-1 + Math.random() * 2, -1 + Math.random() * 2, -1 + Math.random() * 2)
					.normalize()
					.multiplyScalar(speed * 0.75),
			]),
	};
}

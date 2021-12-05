import React, { useEffect, useMemo, useRef } from 'react';
import { Vector3, Object3D } from 'three';
import { useFrame } from '@react-three/fiber';

const dummy = new Object3D();

export const Particles = () => {
	const ref = useRef(null);

	const particles = useMemo(() => randomData(1000, 200, 0.1), []);

	useEffect(() => {
		particles.forEach(({ position, scale }, i) => {
			dummy.position.copy(position);
			dummy.scale.set(scale, scale, scale);
			dummy.rotation.set(
				Math.sin(Math.random()) * Math.PI,
				Math.sin(Math.random()) * Math.PI,
				Math.cos(Math.random()) * Math.PI
			);
			dummy.updateMatrix();
			ref.current.setMatrixAt(i, dummy.matrix);
		});

		ref.current.instanceMatrix.needsUpdate = true;
	}, [particles]);

	useFrame((_, delta) => {
		particles.forEach(({ position, scale }, i) => {
			ref.current.getMatrixAt(i, dummy.matrix);
			dummy.position.copy(position);
			dummy.scale.set(scale, scale, scale);
			dummy.rotation.x += delta * 0.001;

			dummy.updateMatrix();
			ref.current.setMatrixAt(i, dummy.matrix);
		});

		ref.current.instanceMatrix.needsUpdate = true;
	});

	return (
		<instancedMesh ref={ref} args={[null, null, particles.length]} frustumCulled={false}>
			<coneGeometry args={[2, 2, 3]} />
			<meshStandardMaterial color="#414141" />
		</instancedMesh>
	);
};

function randomData(count, radius, scale) {
	const data = [];
	for (let i = 0; i < count; i++) {
		data.push({
			position: new Vector3(
				2 * Math.random() * radius - radius,
				2 * Math.random() * radius - radius,
				2 * Math.random() * radius - radius
			),
			scale: scale + Math.random() * scale,
		});
	}
	return data;
}

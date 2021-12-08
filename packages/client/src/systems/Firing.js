import { useFrame } from '@react-three/fiber';
import { Vector3, BoxBufferGeometry, Color, MeshBasicMaterial, Matrix4, Quaternion } from 'three';
import React, { useEffect, useCallback, useState } from 'react';
import { useSocket } from '../hooks';

const direction = new Vector3();
const origin = new Vector3();

const start = new Vector3();
const end = new Vector3();

const matrix = new Matrix4();
const quaternion = new Quaternion();

const up = new Vector3(0, 1, 0);

const geometry = new BoxBufferGeometry(0.3, 0.3, 3);

const rotate = (position, target) => {
	direction.copy(target);
	origin.copy(position);

	matrix.lookAt(origin, direction, up);
	quaternion.setFromRotationMatrix(matrix);

	return [quaternion.x, quaternion.y, quaternion.z, quaternion.w];
};

export const Firing = () => {
	const socket = useSocket();

	const [lasers, setLasers] = useState([]);

	useFrame((_, dt) => {
		setLasers((lasers) =>
			lasers.filter((laser) => {
				start.copy(laser.position);
				end.copy(laser.target);

				return start.distanceToSquared(end) > 0.5;
			})
		);

		lasers.forEach((laser) => {
			origin.copy(laser.origin);
			direction.copy(laser.target).sub(origin).normalize();
			direction.multiplyScalar(dt * 200);

			laser.position.x += direction.x;
			laser.position.y += direction.y;
			laser.position.z += direction.z;
		});
	});

	const fire = useCallback((data) => {
		setLasers((lasers) => [
			...lasers,
			{
				...data,
				position: { ...data.origin },
				quaternion: rotate(data.origin, data.target),
				material: new MeshBasicMaterial({
					color: new Color(data.weapon.info.color || 'lightgreen'),
				}),
			},
		]);
	}, []);

	useEffect(() => {
		if (!socket) return;

		console.log('Listening to firing');
		socket.on('firing', fire);

		return () => {
			socket.off('firing', fire);
		};
	}, [socket]);

	return (
		<group>
			{lasers.map(({ position, material }, i) => (
				<mesh
					key={i}
					position={[position.x, position.y, position.z]}
					quaternion={quaternion}
					geometry={geometry}
					material={material}
				/>
			))}
		</group>
	);
};

import { Vector3, Matrix4, Quaternion } from 'three';
import { Movable, Transform } from '../models';

/**
 * @param {string} entity
 * @param {Game} game
 */
export const movement = (entity, { get, dt }) => {
	const [movable, transform] = get(entity, Movable, Transform);

	// const selectable = components.get('Selectable');

	if (!(movable && transform)) {
		return;
	}
	const { target, moving } = movable;

	if (!moving) {
		return;
	}

	if (
		Math.abs(target.x - transform.position.x) < 1 &&
		Math.abs(target.y - transform.position.y) < 1 &&
		Math.abs(target.z - transform.position.z) < 1
	) {
		movable.moving = false;
		return;
	}

	transform.position = updatePosition(transform.position, target, dt);
	transform.rotation = { ...transform.rotation, ...updateRotation(target, transform.position) };
};

const direction = new Vector3();
const origin = new Vector3();
const up = new Vector3(0, 1, 0);

const matrix = new Matrix4();
const quaternion = new Quaternion();

function updatePosition(position, target, dt) {
	//distance vectors
	origin.copy(position);
	direction.copy(target);
	direction.sub(origin);

	direction.normalize();
	direction.multiplyScalar(dt * 10);

	position.x += direction.x;
	position.y += direction.y;
	position.z += direction.z;
	return position;
}

function updateRotation(position, target) {
	origin.copy(position);
	direction.copy(target);

	matrix.lookAt(origin, direction, up);
	quaternion.setFromRotationMatrix(matrix);

	return { x: quaternion.x, y: quaternion.y, z: quaternion.z, w: quaternion.w };
}

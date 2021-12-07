import { Vector3 } from 'three';

/**
 * @param {Entity} entity
 */
export const movement = ({ components }, { dt }) => {
	const movable = components.get('Movable');
	const transform = components.get('Transform');
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
};

const direction = new Vector3();
const origin = new Vector3();

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

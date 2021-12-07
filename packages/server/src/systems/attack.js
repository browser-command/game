//Transform, attacker, weapons, movable?

import { Attacker, Combatant, Movable, Transform } from '../models';

export const attack = (entity, { get, has, detach, attach }) => {
	if (!has(entity, Transform, Attacker)) return;

	const [transform] = get(entity, Transform);
	const [{ target }] = get(entity, Attacker);
	// const weapon = components.get('Weapon');

	const radius = 30; // weapon.radius;

	//would need the entity id for this right?
	const [{ position: targetPosition }] = get(target, Transform);
	//check the target position and check if its within our weapon radius
	//we need our target to be within the current position + weapon radius
	if (
		isInsideRadius(
			transform.position.x,
			transform.position.z,
			radius,
			targetPosition.x,
			targetPosition.z
		)
	) {
		if (has(entity, Movable)) {
			const [movable] = get(entity, Movable);
			movable.moving = false;
		}

		console.log('attacking');

		//switch to combatant
		detach(entity, Attacker);

		attach(entity, Combatant.create({ attacker: entity, victim: target }));
		attach(target, Combatant.create({ attacker: entity, victim: target }));
	} else {
		if (has(entity, Movable)) {
			const [movable] = get(entity, Movable);
			movable.moving = true;
			movable.target = { ...targetPosition };
		} else {
			detach(entity, Attacker);
		}
	}
};

function isInsideRadius(currX, currY, radius, tarX, tarY) {
	return (tarX - currX) * (tarX - currX) + (tarY - currY) * (tarY - currY) <= radius * radius;
}

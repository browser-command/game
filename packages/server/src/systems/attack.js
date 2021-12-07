//Transform, attacker, weapons, movable?

import { Combatant } from '../models';

export const attack = ({ id, components }, { world: { entities }, game }) => {
	if (!(components.has('Transform') && components.has('Attacker'))) {
		return;
	}
	const transform = components.get('Transform');
	const attacker = components.get('Attacker');
	// const weapon = components.get('Weapon');

	const radius = 30; // weapon.radius;

	//would need the entity id for this right?
	const target = entities.get(attacker.target);
	const targetPosition = target.components.get('Transform').position;
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
		if (components.has('Movable')) {
			const movable = components.get('Movable');
			movable.moving = false;
		}

		//switch to combatant
		components.delete('Attacker');

		game.add(id, Combatant);
		game.add(target.id, Combatant);
	} else {
		if (components.has('Movable')) {
			const movable = components.get('Movable');
			movable.moving = true;
			movable.target = { ...targetPosition };
		} else {
			components.delete('Attacker');
		}
	}
	return;
};

function isInsideRadius(currX, currY, radius, tarX, tarY) {
	if ((tarX - currX) * (tarX - currX) + (tarY - currY) * (tarY - currY) <= radius * radius) {
		return true;
	} else {
		return false;
	}
}

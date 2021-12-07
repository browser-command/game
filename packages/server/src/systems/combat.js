import { Combatant, Attacker, Transform } from '../models';

export const combat = (entity, { get, has, detach, attach }) => {
	if (!has(entity, Transform, Combatant)) {
		return;
	}

	const [{ position }, { attacker, victim }] = get(entity, Transform, Combatant);
	const [{ position: targetPosition }] = get(victim, Transform);
	const radius = 40;

	if (entity === attacker) {
		if (isInsideRadius(position.x, position.z, radius, targetPosition.x, targetPosition.z)) {
			// Do firing stuff
		} else {
			detach(attacker, Combatant);
			detach(victim, Combatant);

			attach(attacker, Attacker.create({ target: victim }));
		}
	} else {
	}
};

function isInsideRadius(currX, currY, radius, tarX, tarY) {
	return (tarX - currX) * (tarX - currX) + (tarY - currY) * (tarY - currY) <= radius * radius;
}

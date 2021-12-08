import { Combatant, Attacker, Transform, Firing, Weapon } from '../models';

export const combat = (entity, { get, has, detach, attach, exists }) => {
	if (!has(entity, Transform, Combatant)) {
		return;
	}

	const [{ position }, { attacker, victim }] = get(entity, Transform, Combatant);

	const radius = 40;

	if (entity === attacker) {
		if (!exists(victim)) {
			detach(entity, Combatant);

			return;
		}

		const [{ position: targetPosition }] = get(victim, Transform);

		if (isInsideRadius(position.x, position.z, radius, targetPosition.x, targetPosition.z)) {
			if (has(entity, Weapon)) {
				attach(attacker, Firing.create({ victim }));
			}
		} else {
			detach(attacker, Combatant);
			detach(victim, Combatant);

			attach(attacker, Attacker.create({ target: victim }));
		}
	} else {
		if (!exists(attacker)) {
			detach(entity, Combatant);
			return;
		}
	}
};

function isInsideRadius(currX, currY, radius, tarX, tarY) {
	return (tarX - currX) * (tarX - currX) + (tarY - currY) * (tarY - currY) <= radius * radius;
}

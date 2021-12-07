import { Combatant, Attacker } from './models';

export const combat = ({ id, components }, { world: { entities }, game }) => {
	//need position of current entity
	const { position } = components.get('Transform');
	const { attacker, victim } = components.get('Combatant');
	const radius = 30;

	if (id === attacker) {
		if (isInsideRadius(position.x, position.z, radius, victim.x, victim.z)) {
			console.log('BANG');
		} else {
			game.delete(attacker.id, Combatant);
			game.delete(victim.id, Combatant);

			game.add(attacker.id, Attacker);
		}
	} else {
	}
};

function isInsideRadius(currX, currY, radius, tarX, tarY) {
	if ((tarX - currX) * (tarX - currX) + (tarY - currY) * (tarY - currY) <= radius * radius) {
		return true;
	} else {
		return false;
	}
}

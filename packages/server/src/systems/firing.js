//FireCommand, Weapon, Upgradable
import { Weapon, FireCommand, Upgradable, Transform } from '../models';

export const firing = (entity, { get, has, detach, attach }) => {
	//get the attackers weapon
	const [weapon, { position: attackerPos }] = get(entity, Weapon, Transform);

	// weapon.cooldown = Date.now() + weapon.info.cooldown

	let [{ health }] = get(victim, Health);
	const [{ position: firingAtPosition }] = get(victim, Transform);
	//fire()
	health = fire(health, weapon.info);
};

function fire(health, info) {
	//check if weapon is on cool down
	let coolDown = Date.now() + info.cooldown;
	if (Date.now() < coolDown) {
		return health;
	} else {
		//We can fire now
		health -= info.damage;
	}
	return health;
}

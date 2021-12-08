import { Weapon, Firing, Transform, Health } from '../models';

const seconds = (time) => Math.floor(time / 1000);

export const firing = (entity, { get, has, detach, event }) => {
	if (!has(entity, Weapon, Transform, Firing)) {
		return;
	}

	//get the attackers weapon
	const [weapon] = get(entity, Weapon);

	if (weapon.cooldown < seconds(Date.now())) {
		weapon.cooldown = seconds(Date.now()) + weapon.info.cooldown;
		const [{ victim }] = get(entity, Firing);

		if (has(victim, Health)) {
			const [health] = get(victim, Health);
			//fire()
			health.health -= weapon.info.damage;
		}

		// Note: If the client drops a packet, it will never know the entity fired

		const [{ position: origin }] = get(entity, Transform);
		const [{ position: target }] = get(victim, Transform);

		event('firing', { origin, target, weapon });
	}

	detach(entity, Firing);
};

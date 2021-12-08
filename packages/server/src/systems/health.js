import { Health, Transform } from '../models';

export const health = (entity, { get, has, event, remove }) => {
	if (!has(entity, Health)) return;

	const [health] = get(entity, Health);

	if (health.health <= 0) {
		const [{ position }] = get(entity, Transform);
		event('death', { position });

		remove(entity);
	}
};

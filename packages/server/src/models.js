import { float, map, model, object, string } from './network/index.js';

export const Position = model('Position', {
	x: float,
	y: float,
});

export const Entity = model('Entity', {
	id: string,
	components: map(object()),
});

export const World = model('World', {
	entities: map(Entity),
});

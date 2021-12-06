import { float, map, model, object, string } from '@browser-command/core';

export const Position = model('Position', {
	x: float,
	y: float,
});

/**
 * @typedef {{ id: string, components: Map<string, object> }} Entity
 */

export const Entity = model('Entity', {
	id: string,
	components: map(object()),
});

/**
 * @typedef {{ entities: Map<string, Entity> }} World
 */

export const World = model('World', {
	entities: map(Entity),
});

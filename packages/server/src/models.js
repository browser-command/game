import { map, model, object, string, Vector3, Quaternion, boolean } from '@browser-command/core';

export const Transform = model('Transform', {
	position: Vector3,
	rotation: Quaternion,
});

export const Model = model('Model', {
	src: string,
});

export const Movable = model('Movable', {
	moving: boolean,
	target: Vector3,
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

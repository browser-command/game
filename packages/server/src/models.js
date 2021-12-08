import {
	map,
	model,
	object,
	string,
	Vector3,
	Quaternion,
	boolean,
	uint32,
	int32,
} from '@browser-command/core';

export const Transform = model('Transform', {
	position: Vector3,
	rotation: Quaternion,
});

export const Health = model('Health', {
	health: int32,
});

export const Model = model('Model', {
	src: string,
});

export const Movable = model('Movable', {
	moving: boolean,
	target: Vector3,
});

export const Attacker = model('Attacker', {
	target: string,
});

export const Combatant = model('Combatant', {
	attacker: string,
	victim: string,
});

export const Firing = model('Firing', {
	victim: string,
});

export const Weapon = model('Weapon', {
	info: object(),
	cooldown: uint32,
});

export const Selectable = model('Selectable', {
	selected: boolean,
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

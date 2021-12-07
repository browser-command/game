import { Serializer, Vector3 } from '@browser-command/core';
import { Attacker, Entity, Model, Movable, Transform, World } from './models.js';
import { attack } from './systems/attack.js';
import { movement } from './systems/movement.js';
import { generateUUID } from './util.js';

export class Game {
	constructor() {
		/** @type {World} */
		this.world = World.create();

		this.ship = this.create(
			Transform.create({ position: Vector3.create({ x: 100 }) }),
			Model.create({ src: '/models/m1-ship1.obj' }),
			Movable
		);

		/**
		 * @type {Map<string, (c: Map<string, object>, game: { world: World, dt: number }) => void>}
		 */
		this.systems = new Map([
			['attack', attack],
			['movement', movement],
		]);

		this.serializer = new Serializer();
	}

	/**
	 *
	 * @param {Datatype|object} components
	 */
	create(...components) {
		const id = generateUUID();
		const entity = Entity.create({ id });

		for (const component of components) {
			const comp = '$id' in component ? component : component.create();
			entity.components.set(comp['$id'], comp);
		}

		this.world.entities.set(id, entity);

		return id;
	}

	/**
	 *
	 * @param {string} entity
	 * @param {Datatype|object} components
	 */
	add(entity, ...components) {
		const { entities } = this.world;

		if (!entities.has(entity)) {
			throw new Error(`Entity ${entity} does not exist`);
		}

		const entityObject = entities.get(entity);

		for (const component of components) {
			const comp = '$id' in component ? component : component.create();
			entityObject.components.set(comp['$id'], comp);
		}
	}

	get(entity) {
		const { entities } = this.world;

		return entities.get(entity);
	}

	start() {
		setInterval(() => {
			this.update(60 / 1000);
		}, 1000 / 60);
	}

	/**
	 *
	 * @returns {Uint8Array}
	 */
	snapshot() {
		return this.serializer.serialize(this.world);
	}

	update(dt) {
		const { entities } = this.world;

		for (const [, entity] of entities) {
			for (const [, callback] of this.systems) {
				callback(entity, { world: this.world, dt, game: this });
			}
		}
	}
}

import { Serializer } from '@browser-command/core';
import { Entity, Model, Position, World } from './models.js';
import { generateUUID } from './util.js';

export class Game {
	constructor() {
		/** @type {World} */
		this.world = World.create();

		this.ship = this.create(Position, Model.create({ src: '/models/m1-ship1.obj' }));

		/**
		 * @type {Map<string, (c: Map<string, object>, world: object) => void>}
		 */
		this.systems = new Map();

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
			this.update();
		}, 1000 / 60);
	}

	/**
	 *
	 * @returns {Uint8Array}
	 */
	snapshot() {
		return this.serializer.serialize(this.world);
	}

	update() {
		const { entities } = this.world;

		for (const [, entity] of entities) {
			for (const [, callback] of this.systems) {
				callback(entity, this.world);
			}
		}

		const { components } = this.get(this.ship);
		components.get('Position').y += 0.1;
	}
}

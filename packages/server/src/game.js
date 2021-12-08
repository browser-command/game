import { Serializer, Vector3 } from '@browser-command/core';
import { Attacker, Entity, Model, Movable, Transform, Weapon, World, Health } from './models';
import { movement, attack, combat, firing, health } from './systems';
import { generateUUID } from './util';

export class Game {
	constructor(socket) {
		this.socket = socket;

		/** @type {World} */
		this.world = World.create();

		this.ship = this.create(
			Transform.create({ position: Vector3.create({ x: 100 }) }),
			Model.create({ src: 'models/m1-ship1.obj' }),
			Movable,
			Health.create({ health: 100 })
		);

		this.ship2 = this.create(
			Transform.create({ position: Vector3.create({ x: -100 }) }),
			Model.create({ src: 'models/m1-ship1.obj' }),
			Movable,
			Attacker.create({ target: this.ship }),
			Weapon.create({ cooldown: 0, info: { damage: 10, cooldown: 2, radius: 30 } }),
			Health.create({ health: 100 })
		);

		setTimeout(() => {
			const [movable] = this.get(this.ship, Movable);
			movable.target = Vector3.create({ x: -200 });
			movable.moving = true;
		}, 10000);

		/**
		 * @type {Map<string, (entity: string, game: Game) => void>}
		 */
		this.systems = new Map([
			['attack', attack],
			['movement', movement],
			['combat', combat],
			['firing', firing],
			['health', health],
		]);

		this.components = new Map();

		this.dt = 0;

		this.serializer = new Serializer();

		this.exists = this.exists.bind(this);
		this.get = this.get.bind(this);
		this.has = this.has.bind(this);
		this.create = this.create.bind(this);
		this.remove = this.remove.bind(this);
		this.attach = this.attach.bind(this);
		this.detach = this.detach.bind(this);
		this.event = this.event.bind(this);
	}

	exists(entity) {
		return this.world.entities.has(entity);
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

	remove(entity) {
		const { entities } = this.world;

		if (!entities.has(entity)) {
			throw new Error(`Entity ${entity} does not exist`);
		}

		entities.delete(entity);
	}

	/**
	 *
	 * @param {string} entity
	 * @param {Datatype|object} components
	 */
	attach(entity, ...components) {
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

	/**
	 *
	 * @param {string} entity
	 * @param {Datatype} components
	 */
	detach(entity, ...components) {
		const { entities } = this.world;

		if (!entities.has(entity)) {
			throw new Error(`Entity ${entity} does not exist`);
		}

		const entityObject = entities.get(entity);

		for (const component of components) {
			const id = component['$id'] || component['id'];
			entityObject.components.delete(id);
		}
	}

	/**
	 *
	 * @param {string} entity
	 * @param {Datatype} components
	 */
	get(entity, ...components) {
		const { entities } = this.world;

		if (!entities.has(entity)) {
			throw new Error(`Entity ${entity} does not exist`);
		}

		const entityObject = entities.get(entity);

		return components.map((component) => {
			const id = component['$id'] || component['id'];
			return entityObject.components.get(id);
		});
	}

	/**
	 *
	 * @param entity
	 * @param components
	 * @return {boolean}
	 */
	has(entity, ...components) {
		const { entities } = this.world;

		if (!entities.has(entity)) {
			throw new Error(`Entity ${entity} does not exist`);
		}

		const entityObject = entities.get(entity);

		return components.every((component) => {
			const id = component['$id'] || component['id'];
			return entityObject.components.has(id);
		});
	}

	start() {
		setInterval(() => {
			this.update(60 / 1000);
		}, 1000 / 60);
	}

	event(name, data) {
		this.socket.emit(name, data);
	}

	/**
	 *
	 * @returns {Uint8Array}
	 */
	snapshot() {
		return this.serializer.serialize(this.world);
	}

	update(dt) {
		this.dt = dt;

		const { entities } = this.world;

		for (const [entity] of entities) {
			for (const [, callback] of this.systems) {
				callback(entity, this);
			}
		}
	}
}

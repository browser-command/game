import { Serializer } from './network';
import { World } from './models.js';

export class Game {
	constructor() {
		this.world = World.create();

		/**
		 *
		 * @type {Map<string, (c: Map<string, object>) => void>}
		 */
		this.systems = new Map();

		this.serializer = new Serializer();
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
			entityObject.add('$id' in component ? component : component.create());
		}
	}

	get(entity) {
		const { entities } = this.world;

		return entities.get(entity);
	}

	start() {}

	snapshot() {
		return this.serializer.serialize(this.world);
	}

	update() {
		this.entities.forEach((components) => {
			this.systems.forEach((system) => {
				system(components, this.entities);
			});
		});
	}
}

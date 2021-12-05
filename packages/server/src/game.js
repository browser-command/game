export class Game {
	constructor() {
		/**
		 *
		 * @type {Map<string, Map<string, object>>}
		 */
		this.entities = new Map();

		/**
		 *
		 * @type {Map<string, (c: Map<string, object>) => void>}
		 */
		this.systems = new Map();
	}

	update() {
		this.entities.forEach((components) => {
			this.systems.forEach((system) => {
				system(components);
			});
		});
	}
}

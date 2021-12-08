import { Game } from './game';
import { Attacker, Health, Model, Movable, Transform, Weapon } from './models';
import { Vector3 } from '@browser-command/core';

const Weapon1 = { damage: 30, radius: 30, cooldown: 2, color: 'green' };
const Weapon2 = { damage: 20, radius: 40, cooldown: 1, color: 'red' };

export class Demo extends Game {
	constructor(socket) {
		super(socket);

		this.greenShips = [];
		this.redShips = [];

		this.setup();
	}

	setup() {
		let x = -100;
		for (let z = 50; z < 200; z += 10) {
			const realZ = (z / 10) % 2 === 0 ? z : -z;

			this.greenShips.push(
				this.createShip({
					transform: { position: Vector3.create({ x, z: realZ }) },
					weapon: Weapon1,
				})
			);
		}

		x = 100;
		for (let z = 50; z < 200; z += 10) {
			const realZ = (z / 10) % 2 === 0 ? z : -z;

			this.redShips.push(
				this.createShip({
					transform: { position: Vector3.create({ x, z: realZ }) },
					weapon: Weapon2,
				})
			);
		}

		for (let i = 0; i < this.greenShips.length; i++) {
			if (i % 2 === 0) {
				this.attach(this.greenShips[i], Attacker.create({ target: this.redShips[i] }));
				this.attach(this.redShips[i], Attacker.create({ target: this.greenShips[i] }));
			} else {
				this.attach(this.greenShips[i], Attacker.create({ target: this.redShips[i] }));
				this.attach(this.redShips[i], Attacker.create({ target: this.greenShips[i] }));
			}
		}
	}

	update(dt) {
		super.update(dt);
	}

	createShip({ transform, weapon }) {
		return this.create(
			Transform.create({ ...transform }),
			Movable,
			Health.create({ health: 100 }),
			Model.create({ src: 'models/m1-ship1.obj' }),
			Weapon.create({ cooldown: 0, info: weapon })
		);
	}
}

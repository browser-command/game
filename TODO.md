# Checklist

## Components

- Movable
  - Moving
  - Target position
  - Current position
  - Path?
- Selectable?
  - Selected
- Model
  - path/source
- Upgradable
  - available
  - current
  - pending
- Health
- Armor/Shields
- Weapons
  - radius
- Combatant
  - attacker: `boolean`

## Systems

- Movement (Movable, Selectable, Position)

  - `if (target !== position) moving = true; updatePosition() else moving = false`

- Attack (Position, Attacker, Weapons, Movable?)

```javascript
function attack(components) {
  if (!(components.has('position') && components.has('attacker') && components.has('weapons'))) return

  const position = components.get('position')
  const attacker = components.get('attacker')
  const weapon   = components.get('weapon')

  const target = entities.get(attacker.target)
  // Is our target still valid? Did it die? Deal with that if so (remove attacker, etc.)
  const targetPosition = target.components.get('position')

  if (targetPosition < position + weapon.radius) {
    components.delete('attacker')

    components.add('combatant')
    target.components.add('combatant')
  } else {
    if (components.has('movable')) {
      const movable = components.get('movable')
      movable.target = targetPosition
    } else {
      // Give up
    }
  }
}
```

- Combat (Health, Combatant, Armor?, Weapons?)

```javascript
if (isAttacker) {
	if (withinAttackRange) {
		fire();
	} else {
		components.delete('combatant');
		target.components.delete('combatant');

		components.add('attack', { target: target });
	}
} else {
	if (withinAggroRange) {
		fire();
	} else {
		// nothing
	}
}
```

- Firing(FireWeapon, Weapon, Upgradable?)

```javascript
const laserMk2 = { id: 'laserMk2', damage: 100, cooldown: 10 };

const entity = { components: [{ id: 'weapon', weapon: 'laserMk2', nextFire: 0 }] };

const fire = (components) => {
	const weapon = components.get('weapon');
	const fireWeapon = components.get('fireWeapon');

	const weaponInfo = lookup(weapon.id);
	const target = entities.get(fireWeapon.target);
	const targetPosition = target.components.get('position');

	if (weaponInfo.nextFire < performance.now()) {
		fireWeaponEvent(target.position); // .. network a fired event***, or set a boolean ..

		let damage = weaponInfo.damage;

		if (components.has('upgradable')) {
			const { current } = components.get('upgradable');

			for (const upgrade of current) {
				if (upgrade.type !== 'weapon') continue;

				damage = damage * upgrade.damage;
			}
		}

		// Take into account armor/shields

		target.health -= damage;

		weapon.nextFire = perfomance.now() + weaponInfo.cooldown;
	}
};
```

- Upgrade (Upgradable, Selectable)

```javascript
const damageUpgrade = { time: 10, type: 'weapon', damage: 1.1 };

const entity = {
	id: '123124',
	components: [
		{
			id: 'upgradable',
			available: [{ id: 'healthUpgrade', cost: 100 }],
			unavailable: [],
			pending: [
				{
					id: 'damageUpgrade',
					completeTime: 1241511,
				},
			],
		},
	],
};

const requested = []; // an array here but would probably be a topic/observable

/**
 * Upgrade system also listen to network events and check if upgrades are valid
 */
const upgrade = (components) => {
	const upgradable = components.get('upgradable');

	// process upgrades requested
	requested.forEach(() => {
		// check requirements
		// take resources
		// move upgrade to pending
	});

	// update available and unavailable upgrades

	upgradable.pending = upgradable.pending.filter((upgrade) => {
		if (upgrade.completeTime < performance.now()) {
			upgradable.current.push(upgrade);
			return false;
		}

		return true;
	});
};
```

- Building

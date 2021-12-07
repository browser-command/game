import React from 'react';

import { useComponentRegistry } from '../hooks';
import PropTypes from 'prop-types';
import { string } from '@browser-command/core';

export const Combatant = ({ attacker, victim }) => {
	useComponentRegistry('Combatant', { attacker, victim });
	return <></>;
};

Combatant.schema = {
	attacker: string,
	victim: string,
};

Combatant.propTypes = {
	attacker: PropTypes.string,
	victim: PropTypes.string,
};

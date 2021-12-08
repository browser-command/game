import React from 'react';

import { Game, Network } from './game';
import { Space } from './scenes';

import * as components from './components';

import './index.css';
import { Firing, Health } from './systems';

function App() {
	return (
		<Game components={components}>
			<Firing />
			<Health />
			<Network>
				<Space />
			</Network>
		</Game>
	);
}

export default App;

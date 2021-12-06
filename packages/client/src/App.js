import React from 'react';

import { Game, Network } from './game';
import { Space } from './scenes';

import * as components from './components';

import './index.css';

function App() {
	return (
		<Game components={components}>
			<Network>
				<Space />
			</Network>
		</Game>
	);
}

export default App;

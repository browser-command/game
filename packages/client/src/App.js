import React from 'react';

import { Game, Network } from './game';
import { Space } from './scenes';

import './index.css';

function App() {
	return (
		<Game>
			<Network>
				<Space />
			</Network>
		</Game>
	);
}

export default App;

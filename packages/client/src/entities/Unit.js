import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Box, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

import { useSelection } from '../hooks';

export const Unit = ({ ...props }) => {
	const selection = useSelection();
	const [selected, setSelected] = useState(false);
	const ref = useRef(null);

	useEffect(() => {
		console.log('selection', selection);
		console.log('ref', ref.current);
		setSelected(selection.has(ref.current));
	}, [selection, ref]);

	useFrame(() => {
		ref.current.rotation.y += 0.01;
	});

	return (
		<Box ref={ref} {...props}>
			<meshStandardMaterial attach={'material'} color={selected ? 'hotpink' : 'orange'} />
			<Html center distanceFactor={30} style={{ color: '#FFFFFF' }}>
				Unit
			</Html>
		</Box>
	);
};

Unit.propTypes = {
	model: PropTypes.string,
};

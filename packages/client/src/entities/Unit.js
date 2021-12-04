import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

import { useSelection } from '../hooks';

export const Unit = ({ ...props }) => {
	const ref = useRef(null);

	useFrame(() => {
		ref.current.rotation.y += 0.01;
	});

	return (
		<Box ref={ref} {...props}>
			<meshStandardMaterial attach={'material'} />
			<Html center distanceFactor={30} style={{ color: '#FFFFFF' }}>
				Unit
			</Html>
		</Box>
	);
};

Unit.propTypes = {
	model: PropTypes.string,
};

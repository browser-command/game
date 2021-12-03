import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { Box } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export const Unit = ({ ...props }) => {
	const ref = useRef(null);

	const [hovered, hover] = useState(false);
	const [clicked, click] = useState(false);

	useFrame(() => {
		if (!hovered) {
			ref.current.rotation.y += 0.01;
		}
	});

	return (
		<Box
			ref={ref}
			{...props}
			scale={clicked ? 1.5 : 1}
			onClick={() => click(!clicked)}
			onPointerOver={() => hover(true)}
			onPointerOut={() => hover(false)}
		>
			<meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
		</Box>
	);
};

Unit.propTypes = {
	model: PropTypes.string,
};

import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useThree } from '@react-three/fiber';

import { SelectionBox } from 'three/examples/jsm/interactive/SelectionBox';

import { SelectionContext } from '../hooks';

export const Selection = ({ children }) => {
	const { camera, scene, gl } = useThree();

	const selecting = useRef(false);
	const selectionBox = new SelectionBox(camera, scene);
	const [selection, setSelection] = useState(new Set());

	const mouseCoords = (event) => [
		(event.clientX / window.innerWidth) * 2 - 1,
		-(event.clientY / window.innerHeight) * 2 + 1,
	];

	const mouseDown = (event) => {
		if (!selecting.current) {
			setSelection(new Set(selectionBox.select()));
			selecting.current = true;
			const [x, y] = mouseCoords(event);
			selectionBox.startPoint.set(x, y, 0.5);
			selectionBox.endPoint.set(x, y, 0.5);
		}
	};
	const mouseUp = (event) => {
		if (selecting.current) {
			selecting.current = false;
			const [x, y] = mouseCoords(event);
			selectionBox.endPoint.set(x, y, 0.5);
			setSelection(new Set(selectionBox.select()));
			console.log(selection.current);
		}
	};
	const mouseMove = (event) => {
		if (selecting.current) {
			const [x, y] = mouseCoords(event);
			selectionBox.endPoint.set(x, y, 0.5);
			setSelection(new Set(selectionBox.select()));
		}
	};

	useEffect(() => {
		gl.domElement.addEventListener('mousedown', mouseDown);
		gl.domElement.addEventListener('mouseup', mouseUp);
		gl.domElement.addEventListener('mousemove', mouseMove);

		return () => {
			gl.domElement.removeEventListener('mousedown', mouseDown);
			gl.domElement.removeEventListener('mouseup', mouseUp);
			gl.domElement.removeEventListener('mousemove', mouseMove);
		};
	}, []);

	return <SelectionContext.Provider value={selection}>{children}</SelectionContext.Provider>;
};

Selection.propTypes = {
	children: PropTypes.node,
};

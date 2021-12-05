import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useThree } from '@react-three/fiber';

import { SelectionBox } from 'three/examples/jsm/interactive/SelectionBox';

import { SelectionContext } from '../hooks';

export const Selection = ({ children }) => {
	const { camera, scene, gl } = useThree();

	const selecting = useRef(false);
	const selectionElement = useRef(document.createElement('div'));

	const selectionBox = new SelectionBox(camera, scene);
	const [selection, setSelection] = useState(new Set());

	const mouseCoords = (event) => [
		(event.clientX / window.innerWidth) * 2 - 1,
		-(event.clientY / window.innerHeight) * 2 + 1,
	];

	const mouseDown = (event) => {
		if (!selecting.current) {
			selecting.current = true;

			const [x, y] = mouseCoords(event);

			selectionBox.startPoint.set(x, y, 0.5);
			selectionBox.endPoint.set(x, y, 0.5);

			setSelection(new Set(selectionBox.select()));

			gl.domElement.parentElement.appendChild(selectionElement.current);
		}
	};
	const mouseUp = (event) => {
		if (selecting.current) {
			selecting.current = false;

			const [x, y] = mouseCoords(event);

			selectionBox.endPoint.set(x, y, 0.5);

			setSelection(new Set(selectionBox.select()));

			gl.domElement.parentElement.removeChild(selectionElement.current);

			const element = selectionElement.current;

			element.style.left = `${x}px`;
			element.style.top = `${y}px`;
			element.style.width = '0px';
			element.style.height = '0px';
		}
	};
	const mouseMove = (event) => {
		if (selecting.current) {
			const [x, y] = mouseCoords(event);

			selectionBox.endPoint.set(x, y, 0.5);

			setSelection(new Set(selectionBox.select()));

			const bottomRightX = Math.max(selectionBox.startPoint.x, x);
			const bottomRightY = Math.max(selectionBox.startPoint.y, y);
			const topLeftX = Math.min(selectionBox.startPoint.x, x);
			const topLeftY = Math.min(selectionBox.startPoint.y, y);

			const element = selectionElement.current;
			element.style.left = `${topLeftX}px`;
			element.style.top = `${topLeftY}px`;
			element.style.width = `${bottomRightX - topLeftX}px`;
			element.style.height = `${bottomRightY - topLeftY}px`;
		}
	};

	useEffect(() => {
		selectionElement.current.classList.add('selection');
		selectionElement.current.style.pointerEvents = 'none';

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

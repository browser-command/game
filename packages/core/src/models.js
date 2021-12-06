import { float, model } from './network/index.js';

export const Vector3 = model('Vector3', {
	x: float,
	y: float,
	z: float,
});

export const Quaternion = model('Quaternion', {
	x: float,
	y: float,
	z: float,
	w: float,
});

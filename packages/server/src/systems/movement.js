/**
 * @param {Entity} entity
 */
export const movement = ({ components }) => {
	if (!components.has('movable')) {
		console.log('No movable component found');
	}
};

//state should be an object that has a couple of fields
/*
 * let position = [x, y, z],
 * let health = some number value
 */

const reducer = (state = 0, action) => {
	switch (action.type) {
		case 'move':
			return state.position + action.payload;
		case 'damage':
			return state.health - action.payload;
		default:
			return state;
	}
};

export default reducer;

import { combineReducers } from 'redux';
import unitReducer from './unitReducer.js';

const reducers = combineReducers({
	unit: unitReducer,
});

export default reducers;

import { createContext, useContext } from 'react';

export const SelectionContext = createContext(null);

export const useSelection = () => {
	return useContext(SelectionContext);
};

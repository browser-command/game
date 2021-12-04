import { createContext, useContext } from 'react';

export const EntityContext = createContext(null);

export const useEntity = () => {
	return useContext(EntityContext);
};

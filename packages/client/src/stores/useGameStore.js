import create from 'zustand';
import { model } from '@browser-command/core';

export const useGameStore = create((set) => {
	return {
		entities: new Map(),
		components: {},
		registerComponent: (id, Component) => {
			set((state) => {
				model(id, Component.schema);
				state.components = {
					...state.components,
					[id]: Component,
				};
			});
		},
		setEntities: (entities) => {
			set((state) => {
				state.entities = new Map(entities);
			});
		},
	};
});

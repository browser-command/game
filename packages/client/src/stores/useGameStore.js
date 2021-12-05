import create from 'zustand';

export const useGameStore = create((set, get) => {
	return {
		entities: [{ id: '', components: [{ $id: 'model', src: '/models/m1-ship1.obj' }] }],
		components: {
			registered: {},
			register: (name, component) =>
				set((state) => {
					state.components.registered[name] = component;
				}),
			get: (name) => get().components.registered[name],
		},
	};
});

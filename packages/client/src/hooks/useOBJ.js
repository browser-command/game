import { useLoader } from '@react-three/fiber';
import { OBJLoader, MTLLoader } from 'three-stdlib';

export const useOBJ = (path, useMTL = true) => {
	let materials;
	if (useMTL) {
		materials = useLoader(MTLLoader, path.replace(/\.obj$/, '.mtl'));
	}

	return useLoader(
		OBJLoader,
		path,
		useMTL
			? (/** OBJLoader */ loader) => {
					materials.preload();
					loader.setMaterials(materials);
			  }
			: undefined
	);
};

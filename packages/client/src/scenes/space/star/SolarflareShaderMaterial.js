import { ShaderMaterial, AdditiveBlending } from 'three';
import { extend } from '@react-three/fiber';

class SolarflareShaderMaterial extends ShaderMaterial {
	constructor() {
		super({
			uniforms: {
				texturePrimary: { type: 't', value: null },
				time: { type: 'f', value: 0 },
				textureSpectral: { type: 't', value: null },
				spectralLookup: { type: 'f', value: 0 },
			},
			blending: AdditiveBlending,
			color: 0xffffff,
			transparent: true,
			depthTest: true,
			depthWrite: false,
			polygonOffset: true,
			polygonOffsetFactor: -100,
			polygonOffsetUnits: 1000,
			vertexShader: ``,
			fragmentShader: ``,
		});
	}
}

extend({ SolarflareShaderMaterial });

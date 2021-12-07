import { ShaderMaterial, AdditiveBlending } from 'three';
import { extend } from '@react-three/fiber';

class HaloShaderMaterial extends ShaderMaterial {
	constructor() {
		super({
			uniforms: {
				texturePrimary: { type: 't', value: null },
				textureColor: { type: 't', value: null },
				textureSpectral: { type: 't', value: null },
				spectralLookup: { type: 'f', value: 0 },
				time: { type: 'f', value: 0 },
			},
			blending: AdditiveBlending,
			color: 0xffffff,
			transparent: true,
			depthTest: false,
			depthWrite: false,
			polygonOffset: true,
			polygonOffsetFactor: 1,
			polygonOffsetUnits: 100,
			vertexShader: `
				varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * (modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0) + vec4(position.x, position.y, 0.0, 0.0));
				}
			`,
			fragmentShader: `
			varying vec2 vUv;
			uniform sampler2D texturePrimary;
			uniform sampler2D textureColor;
			uniform float time;

			uniform float spectralLookup;
			uniform sampler2D textureSpectral;

			void main() {
			vec3 colorIndex = texture2D( texturePrimary, vUv ).xyz;
			float lookupColor = colorIndex.x;
			lookupColor = fract( lookupColor + time * 0.04 );
			lookupColor = clamp(lookupColor,0.2,0.98);
			vec2 lookupUV = vec2( lookupColor, 0. );
			vec3 foundColor = texture2D( textureColor, lookupUV ).xyz;

			foundColor.xyz += 0.4;
			foundColor *= 10.0;

			float spectralLookupClamped = clamp( spectralLookup, 0., 1. );
			vec2 spectralLookupUV = vec2( 0., spectralLookupClamped );
			vec4 spectralColor = texture2D( textureSpectral, spectralLookupUV );

			spectralColor.x = pow( spectralColor.x, 3. );
			spectralColor.y = pow( spectralColor.y, 3. );
			spectralColor.z = pow( spectralColor.z, 3. );

			gl_FragColor = vec4( foundColor * colorIndex * spectralColor.xyz , 1.0 );
		}
		`,
		});
	}

	get time() {
		return this.uniforms.time.value;
	}

	set time(value) {
		this.uniforms.time.value = value;
	}

	get spectralLookup() {
		return this.uniforms.spectralLookup.value;
	}

	set spectralLookup(value) {
		this.uniforms.spectralLookup.value = value;
	}

	get texturePrimary() {
		return this.uniforms.texturePrimary.value;
	}

	set texturePrimary(value) {
		this.uniforms.texturePrimary.value = value;
	}

	get textureSpectral() {
		return this.uniforms.textureSpectral.value;
	}

	set textureSpectral(value) {
		this.uniforms.textureSpectral.value = value;
	}
}

extend({ HaloShaderMaterial });

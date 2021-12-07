import { useFrame, useLoader } from '@react-three/fiber';
import React, { useEffect, useState } from 'react';

import { TextureLoader, AdditiveBlending } from 'three';

import './SunShaderMaterial';
import './GlowShaderMaterial';
import './HaloShaderMaterial';

export const Star = ({ radius = 8, spectral = 0.9 }) => {
	const [
		sunTexture,
		sunColorLookupTexture,
		solarflareTexture,
		sunHaloTexture,
		sunHaloColorTexture,
		sunCoronaTexture,
		starColorGraph,
		glowspanTexture,
	] = useLoader(TextureLoader, [
		'/materials/sun_surface.png',
		'/materials/star_colorshift.png',
		'/materials/solarflare.png',
		'/materials/sun_halo.png',
		'/materials/halo_colorshift.png',
		'/materials/corona.png',
		'/materials/star_color_modified.png',
		'/materials/glowspan.png',
	]);

	const [time, setTime] = useState(0);

	useFrame(() => {
		setTime(() => time + 0.01);
	});

	return (
		<group>
			<pointLight args={[0xffffff, 10.0]} />
			<mesh>
				<sphereBufferGeometry args={[radius, 60, 30]} />
				<sunShaderMaterial
					texturePrimary={sunTexture}
					textureColor={sunColorLookupTexture}
					textureSpectral={starColorGraph}
					spectralLookup={spectral}
					time={time}
				/>
			</mesh>
			<mesh>
				<planeBufferGeometry args={[25, 25]} />
				<haloShaderMaterial
					texturePrimary={sunHaloTexture}
					textureColor={sunHaloColorTexture}
					textureSpectral={starColorGraph}
					time={time}
					spectralLookup={spectral}
				/>
			</mesh>
			<mesh>
				<planeBufferGeometry args={[120, 120]} />
				<glowShaderMaterial
					texturePrimary={sunCoronaTexture}
					textureSpectral={starColorGraph}
					spectralLookup={spectral}
				/>
			</mesh>
			<mesh>
				<icosahedronBufferGeometry args={[radius, 2]} />
				<meshBasicMaterial
					map={glowspanTexture}
					blending={AdditiveBlending}
					transparent={true}
					depthTest={true}
					depthWrite={true}
					wireframe={true}
					opacity={0.8}
					map-wrapS={'repeat'}
					map-wrapT={'repeat'}
				/>
			</mesh>
		</group>
	);
};

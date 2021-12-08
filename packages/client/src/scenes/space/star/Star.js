import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { AdditiveBlending } from 'three';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

import './SunShaderMaterial';
import './GlowShaderMaterial';
import './HaloShaderMaterial';
import './SolarflareShaderMaterial';

export const Star = ({ radius = 8, spectral = 0.85, position = [0, 0, 0] }) => {
	const [
		sunTexture,
		sunColorLookupTexture,
		solarflareTexture,
		sunHaloTexture,
		sunHaloColorTexture,
		sunCoronaTexture,
		starColorGraph,
		glowspanTexture,
	] = useTexture([
		'materials/sun_surface.png',
		'materials/star_colorshift.png',
		'materials/solarflare.png',
		'materials/sun_halo.png',
		'materials/halo_colorshift.png',
		'materials/corona.png',
		'materials/star_color_modified.png',
		'materials/glowspan.png',
	]);

	const [time, setTime] = useState(0);

	const flares = useMemo(() => {
		const flares = [];

		const container = {
			position: [],
			flare: {},
		};

		for (let i = 0; i < 6; ++i) {}
	}, []);

	useFrame(() => {
		setTime(() => time + 0.01);
	});

	return (
		<group position={position} scale={(1, 1, 1)}>
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
				<planeBufferGeometry args={[26.5, 26.5]} />
				<haloShaderMaterial
					texturePrimary={sunHaloTexture}
					textureColor={sunHaloColorTexture}
					textureSpectral={starColorGraph}
					time={time}
					spectralLookup={spectral}
				/>
			</mesh>
			<mesh>
				<planeBufferGeometry args={[150, 150]} />
				<glowShaderMaterial
					texturePrimary={sunCoronaTexture}
					textureSpectral={starColorGraph}
					spectralLookup={spectral}
				/>
			</mesh>
		</group>
	);
};

Star.propTypes = {
	radius: PropTypes.number,
	spectral: PropTypes.number,
	position: PropTypes.arrayOf(PropTypes.number),
};

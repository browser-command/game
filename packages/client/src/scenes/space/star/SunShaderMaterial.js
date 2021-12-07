import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

const SunShaderMaterial = shaderMaterial(
	{
		texturePrimary: { type: 't', value: null },
		textureColor: { type: 't', value: null },
		textureSpectral: { type: 't', value: null },
		time: { type: 'f', value: 0 },
		spectralLookup: { type: 'f', value: 0 },
	},
	`
			varying vec2 vUv;
			varying vec3 vNormal;
			varying vec3 vPosition;
			void main() {
				vPosition = position;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				vNormal = normalize( normalMatrix * normal );
				vUv = uv;
			}
		`,
	`
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
uniform sampler2D texturePrimary;
uniform sampler2D textureColor;
uniform sampler2D textureSpectral;
uniform float time;
uniform float spectralLookup;

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0; }

float mod289(float x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0; }

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+10.0)*x);
}

float permute(float x) {
     return mod289(((x*34.0)+10.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float taylorInvSqrt(float r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 grad4(float j, vec4 ip)
  {
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

  return p;
  }

// (sqrt(5) - 1)/4 = F4, used once below
#define F4 0.309016994374947451

float snoise(vec4 v)
  {
  const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4
                        0.276393202250021,  // 2 * G4
                        0.414589803375032,  // 3 * G4
                       -0.447213595499958); // -1 + 4 * G4

// First corner
  vec4 i  = floor(v + dot(v, vec4(F4)) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

// Other corners

// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
  vec4 i0;
  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );
//  i0.x = dot( isX, vec3( 1.0 ) );
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;
//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;
  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  // i0 now contains the unique values 0,1,2,3 in each channel
  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  //  x0 = x0 - 0.0 + 0.0 * C.xxxx
  //  x1 = x0 - i1  + 1.0 * C.xxxx
  //  x2 = x0 - i2  + 2.0 * C.xxxx
  //  x3 = x0 - i3  + 3.0 * C.xxxx
  //  x4 = x0 - 1.0 + 4.0 * C.xxxx
  vec4 x1 = x0 - i1 + C.xxxx;
  vec4 x2 = x0 - i2 + C.yyyy;
  vec4 x3 = x0 - i3 + C.zzzz;
  vec4 x4 = x0 + C.wwww;

// Permutations
  i = mod289(i);
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

// Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
// 7*7*6 = 294, which is close to the ring size 17*17 = 289.
  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

// Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

// Mix contributions from the five corners
  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

  }

  float fbm(vec4 p) {
  	float sum = 0.;
  	float amp = 1.;
  	float scale = 1.;
  	for(int i=0;i<6;i++) {
  		sum += snoise(p * scale) * amp;
  		p.w += 100.;
  		amp *= 0.9;
  		scale *= 2.;
  	}

  	return sum;
  }

void main() {
	float uvMag = 1.0;
	float paletteSpeed = 0.1;
	float minLookup = 0.2;
	float maxLookup = 0.98;

	//	let's double up on the texture to make the sun look more detailed
	vec2 uv = vUv * uvMag;

	//	do a lookup for the texture now, but hold on to its gray value
	vec3 colorIndex = texture2D( texturePrimary, uv ).xyz;
	float lookupColor = colorIndex.x;

	//	now cycle the value, and clamp it, we're going to use this for a second lookup
	lookupColor = fract( lookupColor - time * paletteSpeed );
	lookupColor = clamp(lookupColor, minLookup, maxLookup );

	//	use the value found and find what color to use in a palette texture
	vec2 lookupUV = vec2( lookupColor, 0. );
	vec3 foundColor = texture2D( textureColor, lookupUV ).xyz;

	//	now do some color grading
	foundColor.xyz *= 0.6;
	foundColor.x = pow(foundColor.x, 2.);
	foundColor.y = pow(foundColor.y, 2.);
	foundColor.z = pow(foundColor.z, 2.);

	foundColor.xyz += vec3( 0.6, 0.6, 0.6 ) * 1.4;
	//foundColor.xyz += vec3(0.6,0.35,0.21) * 2.2;

	float spectralLookupClamped = clamp( spectralLookup, 0., 1. );
	vec2 spectralLookupUV = vec2( 0., spectralLookupClamped );
	vec4 spectralColor = texture2D( textureSpectral, spectralLookupUV );

	spectralColor.x = pow( spectralColor.x, 2. );
	spectralColor.y = pow( spectralColor.y, 2. );
	spectralColor.z = pow( spectralColor.z, 2. );

	foundColor.xyz *= spectralColor.xyz;


	//	apply a secondary, subtractive pass to give it more detail
	//	first we get the uv and apply some warping
	vec2 uv2 = vec2( vUv.x + cos(time) * 0.001, vUv.y + sin(time) * 0.001 );
	vec3 secondaryColor = texture2D( texturePrimary, uv2 ).xyz;

	//	finally give it an outer rim to blow out the edges
	float intensity = 1.15 - dot( vNormal, vec3( 0.0, 0.0, 0.3 ) );
	vec3 outerGlow = vec3( 1.0, 0.8, 0.6 ) * pow( intensity, 6.0 );

	vec3 desiredColor = foundColor + outerGlow - secondaryColor;
	float darkness = 1.0 - clamp( length( desiredColor ), 0., 1. );
	vec3 colorCorrection = vec3(0.7, 0.4, 0.01) * pow(darkness,2.0) * secondaryColor;
	desiredColor += colorCorrection;

	//	the final composite color
	vec3 finalColor = desiredColor;

	vec4 p = vec4(vPosition * 1., time * 0.02);
	float noisy = fbm(p);

	vec4 p1 = vec4(vPosition * 0.5, time * 0.02);
	float spots = max(snoise(p1), 0.);

	gl_FragColor = vec4(finalColor + (noisy - 0.5) * 0.5, 1.0);
	// gl_FragColor = vec4(noisy);
	gl_FragColor *= mix(1.,spots,0.1);
}
`
);

extend({ SunShaderMaterial });

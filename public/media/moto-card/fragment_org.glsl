#ifdef TEXTURE_LOD_EXT
	#define texCube(a, b) textureCube(a, b)
	#define texCubeBias(a, b, c) textureCubeLodEXT(a, b, c)
	#define tex2D(a, b) texture2D(a, b)
	#define tex2DBias(a, b, c) texture2DLodEXT(a, b, c)
#else
	#define texCube(a, b) textureCube(a, b)
	#define texCubeBias(a, b, c) textureCube(a, b, c)
	#define tex2D(a, b) texture2D(a, b)
	#define tex2DBias(a, b, c) texture2D(a, b, c)
#endif

			// NOTE: Include Spline's blending modes. This could be part of BlendNode
			#define SPE_BLENDING_NORMAL 0
			#define SPE_BLENDING_MULTIPLY 1
			#define SPE_BLENDING_SCREEN 2
			#define SPE_BLENDING_OVERLAY 3

			vec3 spe_normalBlend( vec3 a, vec3 b, float alpha ) {
				return mix( a, b, alpha );
			}

			vec3 spe_multiplyBlend( vec3 a, vec3 b, float alpha ) {
				return mix( a, a * b, alpha );
			}

			vec3 spe_screenBlend( vec3 a, vec3 b, float alpha ) {
				vec3 tmp = 1.0 - ( 1.0 - a ) * ( 1.0 - b );
				return mix( a, tmp, alpha );
			}

			vec3 spe_overlayBlend( vec3 a, vec3 b, float alpha ) {
				vec3 tmp = mix( 1. - 2. * (1. - a) * (1. - b), 2. * a * b, step( a, vec3(.5) ) );
				return clamp( mix( a, tmp, alpha ), 0.0, 1.0 );
			}

			vec3 spe_blend( vec3 a, vec3 b, float alpha, int mode ) {
				if ( mode == SPE_BLENDING_NORMAL ) return spe_normalBlend( a, b, alpha );
				else if ( mode == SPE_BLENDING_MULTIPLY ) return spe_multiplyBlend( a, b, alpha );
				else if ( mode == SPE_BLENDING_SCREEN ) return spe_screenBlend( a, b, alpha );
				else if ( mode == SPE_BLENDING_OVERLAY ) return spe_overlayBlend( a, b, alpha );
				return vec3( 1.0 );
			}
			
#include <packing>
#include <common>
float accumAlpha = 0.0;
void accumulateAlpha(float alpha) {
					accumAlpha += (1.0 - accumAlpha) * alpha;
				}

layout(location = 1) out vec4 gVelocity;

uniform int frameIndex;
uniform vec2 resolution;

varying vec4 vCurrentPosition;
varying vec4 vPreviousPosition;

const vec2 haltonSequence[16] = vec2[16](
vec2( 0.000000,-0.333334),
vec2(-0.500000, 0.333334),
vec2( 0.500000,-0.777778),
vec2(-0.750000,-0.111112),
vec2( 0.250000, 0.555556),
vec2(-0.250000,-0.555556),
vec2( 0.750000, 0.111112),
vec2(-0.875000, 0.777778),
vec2(0.125000, -0.925926),
vec2(-0.375000, -0.259260),
vec2(0.625000, 0.407408),
vec2(-0.625000, -0.703704),
vec2(0.375000, -0.037038),
vec2(-0.125000, 0.629630),
vec2(0.875000, -0.481482),
vec2(-0.937500, 0.185186));

vec2 vogelDiskSample(int sampleIndex, int sampleCount, float angle) {
  const float goldenAngle = 2.399963f; // radians
  float r = sqrt(float(sampleIndex) + 0.5f) / sqrt(float(sampleCount));
  float theta = float(sampleIndex) * goldenAngle + angle;
  float sine = sin(theta);
  float cosine = cos(theta);
  return vec2(cosine, sine) * r;
}

// Derived from the interleaved gradient function from Jimenez 2014 http:goo.gl/eomGso
float getNoiseInterleavedGradient(vec2 screenPos) {
    vec3 magic = vec3(0.06711056f, 0.00583715f, 52.9829189f);
    return fract(magic.z * fract(dot(screenPos, magic.xy)));
}


varying vec3 vViewPosition;
varying vec3 vWPosition;
uniform float penumbraSize[5];
uniform sampler2D aoMap;
uniform bool aoEnabled;
#include <normal_pars_fragment>
#include <dithering_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <lights_physical_pars_fragment>
#include <shadowmap_pars_fragment>
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vObjectNormal;


uniform vec3 nodeU0;
uniform float nodeU1;
uniform float nodeU2;
uniform bool nodeU3;
uniform float nodeU4;
uniform int nodeU5;
uniform sampler2D nodeU6;
uniform bool nodeU7;
uniform float nodeU8;
uniform int nodeU9;
uniform float nodeU10;
uniform sampler2D nodeU11;
uniform vec3 nodeU12;
uniform float nodeU13;
uniform mat3 nodeU14;
uniform vec2 nodeU15;
uniform float nodeU16;
uniform bool nodeU17;
uniform float nodeU18;
uniform int nodeU19;
uniform float nodeU20;
uniform float nodeU21;
uniform float nodeU22;
uniform float nodeU23;




vec3 matcap(sampler2D matcapTex, vec3 normal, bool isMask, float mask, float alpha, int mode, out float calpha, float rotation) {
					vec3 viewDir = normalize( vViewPosition );
					vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
					vec3 y = cross( viewDir, x );
					vec2 vUv = vec2( dot( x, normal ), dot( y, normal ) );
					vUv = mat2( cos(rotation), sin(rotation), -sin(rotation), cos(rotation) ) * vUv;
					vUv = vUv * 0.495 + 0.5;
					vec4 matcapColor = texture2D( matcapTex, vUv );

					float lalpha = alpha * mask;
					calpha = mix(lalpha / clamp(lalpha + accumAlpha, 0.00001, 1.0), lalpha, float(isMask));
					accumAlpha += (1.0 - accumAlpha) * lalpha * (1.0 - float(isMask));
					
					return matcapColor.rgb;
            	}
vec3 g_uid12_uvTexture(vec3 normal, sampler2D tex, vec2 textureSize, float crop, mat3 mat, vec2 size, float blending, bool isMask, float mask, float alpha, int mode, out float calpha, out vec2 writeUv) {
				vec2 uvs = ( mat * vec3( vUv * 2. - 1., 1. ) / 2. + 0.5 ).xy;
				writeUv = uvs;

				vec4 tmp = texture2D( tex, uvs );

				vec3 col = tmp.rgb;

				float lalpha = alpha * tmp.a;
				if ( crop > 0.5 ) {
					if ( uvs.x < 0.0 || uvs.x > 1.0 || uvs.y < 0.0 || uvs.y > 1.0 )  {
						lalpha = 0.0;
					}
				}
				
				lalpha *= mask;

				calpha =  lalpha / clamp( lalpha + accumAlpha, 0.00001, 1.0 );
				accumAlpha += (1.0 - accumAlpha) * lalpha * (1.0 - float(isMask));

				return col;
			}
vec2 dHdxy(sampler2D bumpMap, vec2 bumpMapUv, float bumpScale) {

            // Gradient of UVs w.r.t. X coordinate (in screen-space)
            vec2 dSTdx = dFdx(bumpMapUv);

            // Gradient of UVs w.r.t. Y coordinate (in screen-space)
            vec2 dSTdy = dFdy(bumpMapUv);
            
            // Forward differencing
            float Hll = bumpScale * luminance(texture(bumpMap, bumpMapUv).rgb);
            float dBx = bumpScale * luminance(texture(bumpMap, bumpMapUv + dSTdx).rgb) - Hll;
            float dBy = bumpScale * luminance(texture(bumpMap, bumpMapUv + dSTdy).rgb) - Hll;
            
            return vec2( dBx, dBy );
        }
vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
            vec3 vSigmaX = dFdx( surf_pos.xyz );
            vec3 vSigmaY = dFdy( surf_pos.xyz );
            vec3 vN = surf_norm; // normalized
            
            vN = normalize(vN);

            vec3 R1 = cross( vSigmaY, vN );
            vec3 R2 = cross( vN, vSigmaX );

            R1 = normalize(R1);
            R2 = normalize(R2);
    
            float fDet = dot( vSigmaX, R1 ) * faceDirection;
    
            vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
            return normalize( abs( fDet ) * vN - vGrad );
        }

void main() {

float g_uid19_calpha;
float g_uid12_calpha;
vec2 g_uid12_writeUvs;

#include <clipping_planes_fragment>
	#include <normal_fragment_begin>

				// NOTE: gl_FrontFacing alternative using face normal estimation.
				vec3 viewdx = dFdx(vViewPosition);
				vec3 viewdy = dFdy(vViewPosition);
				vec3 faceNormal = normalize(cross(viewdx,viewdy));
				if (dot(normal, faceNormal) < 0.0) {
					normal *= -1.0;
				}
				
	PhysicalMaterial material;
	material.diffuseColor = vec3( 1.0 );
// Call the Texture Layer's function once here so that it writes out its procedural UV coordinates
					g_uid12_uvTexture(normal,nodeU11,nodeU12.xy,nodeU13,nodeU14,nodeU15,nodeU16,nodeU17,1.0,nodeU18,nodeU19,g_uid12_calpha,g_uid12_writeUvs);
					
					vec2 bumpMapCachedUv = g_uid12_writeUvs;
					vec2 grad = dHdxy(nodeU11, bumpMapCachedUv, nodeU23);
					normal = perturbNormalArb( - vViewPosition, normal, grad, faceDirection );
					
					

	vec3 diffuseColor = nodeU0;
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );

	float metalnessFactor = nodeU2;

	float roughnessFactor = nodeU1;

#ifdef ALPHATEST
	if ( nodeU20 <= ALPHATEST ) discard;
#endif
// three r166+: `geometryNormal` z normal_fragment_begin przemianowano na `nonPerturbedNormal`
// (tu, PRZED `#include <lights_fragment_begin>`, który deklaruje własne `geometryNormal`).
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.diffuseColor = diffuseColor * ( 1.0 - metalnessFactor );
material.roughness = max( roughnessFactor, 0.0525 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
material.roughness = clamp( roughnessFactor, 0.04, 1.0 );

material.specularColor = mix( vec3( 0.16 * pow2( nodeU21 ) ), diffuseColor, metalnessFactor );
#include <lights_fragment_begin>
#include <lights_fragment_end>
vec3 ao = aoEnabled && nodeU3 ? tex2D(aoMap, gl_FragCoord.xy / resolution).rgb : vec3(1.0);
vec3 outgoingLight = ((reflectedLight.directDiffuse + reflectedLight.indirectDiffuse)) + reflectedLight.directSpecular + reflectedLight.indirectSpecular;

				if (outgoingLight != diffuseColor) {
					float lightAccu = clamp( length( reflectedLight.directSpecular + reflectedLight.indirectSpecular ), 0.0, 1.0 );
					accumAlpha += ( 1.0 - accumAlpha ) * nodeU4 * 1.0 * lightAccu;
					outgoingLight = spe_blend( diffuseColor, outgoingLight, nodeU4 * 1.0, nodeU5 );
					
					outgoingLight *= ao;
				}
				

outgoingLight = spe_blend(outgoingLight, spe_blend(spe_blend(vec3( ( outgoingLight ) ),matcap(nodeU6,normal,nodeU7,1.0,nodeU8,nodeU9,g_uid19_calpha,nodeU10),( g_uid19_calpha ),nodeU9),g_uid12_uvTexture(normal,nodeU11,nodeU12.xy,nodeU13,nodeU14,nodeU15,nodeU16,nodeU17,1.0,nodeU18,nodeU19,g_uid12_calpha,g_uid12_writeUvs),( g_uid12_calpha ),nodeU19), 1.0, SPE_BLENDING_NORMAL);
gl_FragColor = vec4( outgoingLight, accumAlpha * nodeU20 );
gl_FragColor.a *= nodeU22;
#include <colorspace_fragment>
#include <fog_fragment>
#include <dithering_fragment>

}
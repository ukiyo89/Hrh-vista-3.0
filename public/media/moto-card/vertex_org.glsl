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
float neighbor_offset = 0.0001;

uniform int frameIndex;
uniform vec2 resolution;
uniform mat4 previousModelViewMatrix;
uniform mat4 previousProjectionMatrix;

varying vec4 vCurrentPosition;
varying vec4 vPreviousPosition;

varying vec3 vViewPosition;
varying vec3 vWPosition;
#include <fog_pars_vertex>
#include <skinning_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <shadowmap_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vObjectNormal;







void main() {


#include <beginnormal_vertex>
#include <morphnormal_vertex>

				#include <skinbase_vertex>
				#include <skinnormal_vertex>
				#if !defined( USE_LAYER_DISPLACE )
					#include <defaultnormal_vertex>
				#endif

				vec3 displaced_position = position;
				vec3 displaced_normal = objectNormal;

				#if defined( USE_LAYER_DISPLACE )
					vec3 transformed;
					vec3 transformedNormal;
				#endif
				
#include <normal_vertex>

				#if !defined( USE_LAYER_DISPLACE )
					#include <begin_vertex>
				#endif /* !USE_LAYER_DISPLACE */
				
transformed = displaced_position;
#include <morphtarget_vertex>
#include <skinning_vertex>
transformedNormal = normalMatrix * displaced_normal;
#ifndef FLAT_SHADED
    vNormal = transformedNormal;
#endif
#include <project_vertex>
#include <fog_vertex>
#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
#include <worldpos_vertex>
#include <shadowmap_vertex>
vWPosition = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;
vUv = uv;
vPosition = transformed;

				#ifndef SHAPEBLEND 
					vObjectNormal = normal;
				#else
					vObjectNormal = objectNormal;
				#endif
			

}
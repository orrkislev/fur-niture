import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { choose, random, runFrameFuncs } from './utils';
import { colors } from './_coloring';


export let renderer, scene, camera, controls;

export function setup() {
	softShadowShader()

	// renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	const windowSize = Math.min(window.innerWidth, window.innerHeight);
	renderer.setSize(windowSize, windowSize);
	renderer.setClearColor(0x000000, 0);
	renderer.localClippingEnabled = true;
	document.body.appendChild(renderer.domElement);
	// center canvas
	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.top = '50%';
	renderer.domElement.style.left = '50%';
	renderer.domElement.style.transform = 'translate(-50%, -50%)';

	// scene and camera
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
	// camera.position.set(-10, 15, -40);
	camera.position.set(0, random(10,20), 0);


	// controls
	controls = new OrbitControls(camera, renderer.domElement);
	controls.autoRotate = true;
	controls.autoRotateSpeed = 3;
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;
	controls.enableZoom = false; // disable zoom
	controls.enablePan = false; // disable pan
	controls.minPolarAngle = Math.PI / 4;
	controls.maxPolarAngle = Math.PI / 2;
	

    // shadow and tone mapping
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    // environment and background
    const environment = new RoomEnvironment();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    // scene.background = new THREE.Color(0xbbbbbb);
    scene.environment = pmremGenerator.fromScene(environment).texture;

	const bottomColor = random() < .4 ? 'white' : choose(colors)
	document.body.style.background = `linear-gradient(20deg, ${bottomColor} 0%, ${choose(colors)} 100%)`;
	document.body.style.height = '100vh';
}

let frameCount = 0
export function animate() {
	requestAnimationFrame(animate);
    runFrameFuncs()
    controls.update();
    renderer.render(scene, camera);
	if (frameCount++ == 20) fxpreview()
}


export function lights() {
    const ambient = new THREE.AmbientLight(0xffffff, .2);
    scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xffccaa, 1);
    directional.position.set(-5, 50, 15);
    directional.castShadow = true;
    directional.shadow.camera.top = 50;
    directional.shadow.camera.bottom = -50;
    directional.shadow.camera.left = -50;
    directional.shadow.camera.right = 50;
    directional.shadow.camera.far = 1000;
    directional.shadow.mapSize.width = 1024;
    directional.shadow.mapSize.height = 1024;

    scene.add(directional);
}



function softShadowShader() {
    const pcss = `
    			#define LIGHT_WORLD_SIZE 0.002
				#define LIGHT_FRUSTUM_WIDTH 3.75
				#define LIGHT_SIZE_UV (LIGHT_WORLD_SIZE / LIGHT_FRUSTUM_WIDTH)
				#define NEAR_PLANE 5.5

				#define NUM_SAMPLES 17
				#define NUM_RINGS 11
				#define BLOCKER_SEARCH_NUM_SAMPLES NUM_SAMPLES

				vec2 poissonDisk[NUM_SAMPLES];

				void initPoissonSamples( const in vec2 randomSeed ) {
					float ANGLE_STEP = PI2 * float( NUM_RINGS ) / float( NUM_SAMPLES );
					float INV_NUM_SAMPLES = 1.0 / float( NUM_SAMPLES );

					// jsfiddle that shows sample pattern: https://jsfiddle.net/a16ff1p7/
					float angle = rand( randomSeed ) * PI2;
					float radius = INV_NUM_SAMPLES;
					float radiusStep = radius;

					for( int i = 0; i < NUM_SAMPLES; i ++ ) {
						poissonDisk[i] = vec2( cos( angle ), sin( angle ) ) * pow( radius, 0.75 );
						radius += radiusStep;
						angle += ANGLE_STEP;
					}
				}

				float penumbraSize( const in float zReceiver, const in float zBlocker ) { // Parallel plane estimation
					return (zReceiver - zBlocker) / zBlocker;
				}

				float findBlocker( sampler2D shadowMap, const in vec2 uv, const in float zReceiver ) {
					// This uses similar triangles to compute what
					// area of the shadow map we should search
					float searchRadius = LIGHT_SIZE_UV * ( zReceiver - NEAR_PLANE ) / zReceiver;
					float blockerDepthSum = 0.0;
					int numBlockers = 0;

					for( int i = 0; i < BLOCKER_SEARCH_NUM_SAMPLES; i++ ) {
						float shadowMapDepth = unpackRGBAToDepth(texture2D(shadowMap, uv + poissonDisk[i] * searchRadius));
						if ( shadowMapDepth < zReceiver ) {
							blockerDepthSum += shadowMapDepth;
							numBlockers ++;
						}
					}

					if( numBlockers == 0 ) return -1.0;

					return blockerDepthSum / float( numBlockers );
				}

				float PCF_Filter(sampler2D shadowMap, vec2 uv, float zReceiver, float filterRadius ) {
					float sum = 0.0;
					float depth;
					#pragma unroll_loop_start
					for( int i = 0; i < 17; i ++ ) {
						depth = unpackRGBAToDepth( texture2D( shadowMap, uv + poissonDisk[ i ] * filterRadius ) );
						if( zReceiver <= depth ) sum += 1.0;
					}
					#pragma unroll_loop_end
					#pragma unroll_loop_start
					for( int i = 0; i < 17; i ++ ) {
						depth = unpackRGBAToDepth( texture2D( shadowMap, uv + -poissonDisk[ i ].yx * filterRadius ) );
						if( zReceiver <= depth ) sum += 1.0;
					}
					#pragma unroll_loop_end
					return sum / ( 2.0 * float( 17 ) );
				}

				float PCSS ( sampler2D shadowMap, vec4 coords ) {
					vec2 uv = coords.xy;
					float zReceiver = coords.z; // Assumed to be eye-space z in this code

					initPoissonSamples( uv );
					// STEP 1: blocker search
					float avgBlockerDepth = findBlocker( shadowMap, uv, zReceiver );

					//There are no occluders so early out (this saves filtering)
					if( avgBlockerDepth == -1.0 ) return 1.0;

					// STEP 2: penumbra size
					float penumbraRatio = penumbraSize( zReceiver, avgBlockerDepth );
					float filterRadius = penumbraRatio * LIGHT_SIZE_UV * NEAR_PLANE / zReceiver;

					// STEP 3: filtering
					//return avgBlockerDepth;
					return PCF_Filter( shadowMap, uv, zReceiver, filterRadius );
				}
    `

    const pcssGetShadow = `
        return PCSS( shadowMap, shadowCoord );
    `

    let shader = THREE.ShaderChunk.shadowmap_pars_fragment;

    shader = shader.replace(
        '#ifdef USE_SHADOWMAP',
        '#ifdef USE_SHADOWMAP' +
        pcss
    );

    shader = shader.replace(
        '#if defined( SHADOWMAP_TYPE_PCF )',
        pcssGetShadow +
        '#if defined( SHADOWMAP_TYPE_PCF )'
    );

    THREE.ShaderChunk.shadowmap_pars_fragment = shader;
}
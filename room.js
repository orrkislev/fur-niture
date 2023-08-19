import * as THREE from 'three';
import { scene } from './setups';

export function room(){
    const floorGeometry = new THREE.PlaneGeometry( 100, 100, 32 );
    const floorMaterial = new THREE.ShadowMaterial( { color: 0x555555 } );
    const floor = new THREE.Mesh( floorGeometry, floorMaterial );
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add( floor );
}
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { fur, furBaseMaterial } from '../fur';

export async function beanbag() {

    const loader = new OBJLoader();
    const model = await loader.loadAsync('furniture/beanbag.obj');
    model.children.forEach(child => {
        const geometry = child.geometry;
        geometry.scale(5,5,5)
        const mesh = new THREE.Mesh(geometry, furBaseMaterial);
        mesh.castShadow = true
        fur(mesh, 100 * 1000, .05)
    })
}
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { fur, furBaseMaterial } from '../fur';
import { scene } from '../setups';
import { random } from '../utils';

export async function beanbag() {

    const loader = new OBJLoader();
    const model = await loader.loadAsync('furniture/beanbag.obj');
    model.children.forEach(child => {
        const geometry = child.geometry;
        geometry.scale(5, 5, 5)
        const mesh = new THREE.Mesh(geometry, furBaseMaterial);
        mesh.castShadow = true
        fur(mesh, 100 * 1000, .05)
    })

    scene.rotateY(random() < .5 ? -3 * Math.PI / 4 : -Math.PI / 4)
}
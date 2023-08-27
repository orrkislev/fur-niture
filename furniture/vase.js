import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { fur, furBaseMaterial } from '../fur';
import { scene } from '../setups';

export async function vase() {

    const loader = new OBJLoader();
    const model = await loader.loadAsync('furniture/vase.obj');
    model.children.forEach(child => {
        const geometry = child.geometry;
        geometry.scale(8,8,8)
        const mesh = new THREE.Mesh(geometry, furBaseMaterial);
        mesh.castShadow = true
        fur(mesh, 100 * 1000)
    })

    scene.rotateY(Math.PI / 2)
}
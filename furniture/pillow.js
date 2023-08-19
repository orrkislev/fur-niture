import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { fur, furBaseMaterial } from '../fur';

export async function pillow() {

    const loader = new OBJLoader();
    const model = await loader.loadAsync('furniture/pillow.obj');
    model.children.forEach(child => {
        const geometry = child.geometry;
        geometry.scale(4,4,4)
        const mesh = new THREE.Mesh(geometry, furBaseMaterial);
        mesh.castShadow = true
        fur(mesh, 100 * 1000)
    })
}
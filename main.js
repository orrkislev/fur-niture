import * as THREE from 'three';
import { room } from './room.js';
import { setup, animate, scene, lights, controls, camera } from './setups.js';
import { chaise } from './furniture/chaise.js';
import coffeTable from './furniture/coffeTable.js';
import { endTable, lamp } from './furniture/endTable.js';
import { ottoman } from './furniture/ottoman.js';
import { beanbag } from './furniture/beanbag.js';
import { stool } from './furniture/stool.js';
import { chair } from './furniture/chair.js';
import { vase } from './furniture/vase.js';
import { choose } from './utils.js';
import { initColoring } from './_coloring.js';

let furniture = null
function params(){
    furniture = choose([
        chaise, coffeTable, endTable, 
        lamp, ottoman, beanbag, 
        stool, chair, vase
    ])
    initColoring()
}

async function main() {
    params()
    setup();

    await furniture()

    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    controls.target.copy(center);
    const boxSize = box.getSize(new THREE.Vector3())
    const farthest = Math.max(boxSize.x, boxSize.z)
    camera.position.z = farthest + boxSize.y

    room()
    lights()
    animate();
}
main()

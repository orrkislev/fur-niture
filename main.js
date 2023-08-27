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
import { choose, random } from './utils.js';
import { colorPattern, initColoring } from './_coloring.js';
import { pillow } from './furniture/pillow.js';

let furniture = null
function params(){
    furniture = choose([
        {func:chaise, name:'Chaise'}, 
        {func:coffeTable, name:'Coffe Table'},
        {func:endTable,  name:'End Table'},
        {func:lamp,  name:'Lamp'},
        {func:ottoman,  name:'Ottoman'},
        {func:beanbag,  name:'Beanbag'},
        {func:stool,  name:'Stool'},
        {func:chair,  name:'Chair'},
        {func:vase, name:'Vase'},
        {func:pillow, name:'Pillow'},
    ])
    initColoring()


    const features = {
        'Furniture Piece': furniture.name,
    }
    if (colorPattern.name) features['Color Pattern'] = colorPattern.name
    $fx.features(features)

    console.log($fx.getFeatures())
}

async function main() {
    params()

    setup();

    await furniture.func()

    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    controls.target.copy(center);
    const boxSize = box.getSize(new THREE.Vector3())
    const farthest = Math.max(boxSize.x, boxSize.z)
    const r = farthest + boxSize.y
    const a = random(-.4,.4)
    camera.position.x = r * Math.sin(a)
    camera.position.z = r * Math.cos(a)

    room()
    lights()
    animate();
}
main()

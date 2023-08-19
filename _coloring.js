import * as THREE from 'three';
import { choose, perlin, random } from './utils';

const colors = [
    'lightgreen',
    'lightblue',
    'pink',
    'orange',
    'yellow',
    'purple',
    'cornflowerblue',
    'coral',
    'white'
]


let clr1 = null
let clr2 = null
let colorPattern = null
let patternScale = 1
export function initColoring(){
    const duoColor = random() < .5

    clr1 = choose(colors)
    clr2 = choose(colors)
    if (random()<0.2) clr2 = choose(colors)

    clr1 = new THREE.Color(clr1)
    clr2 = new THREE.Color(clr2)

    if (duoColor) colorPattern = choose(Object.values(coloringPattern))
    else colorPattern = (pos) => clr1

    patternScale = random(.5, 1.5)
}

export function getColor(pos){
    return colorPattern(pos, clr1, clr2)
}

const coloringPattern = {
    zebra: (pos) => {
        const clrNoisePos = pos.clone().multiplyScalar(.2 * patternScale)
        clrNoisePos.z *= 10
        const clrNoise = perlin.get3(clrNoisePos);
        let clr = clr1
        if (clrNoise < -.2) clr = clr2
        // else if (clrNoise < .2) {
        //     const v = (clrNoise + .2) / .4
        //     clr = clr2.lerp(clr1, v)
        // }
        return clr
    },
    stripes: (pos) => {
        const patternPos = pos.clone().multiplyScalar(.2)
        let v = Math.abs(patternPos.x) + Math.abs(patternPos.y) + Math.abs(patternPos.z)
        v *= 15 * patternScale
        let clr = clr1
        if (v % 2 < 1) clr = clr2
        return clr
    },
    cow: (pos) => {
        const patternPos = pos.clone().multiplyScalar(.2 * patternScale)
        const v = perlin.get3(patternPos)
        let clr = clr1
        if (v < 0) clr = clr2
        return clr
    },
    cameo: (pos) => {
        let clr = new THREE.Color(0xffffff)
        let noisePos = pos.clone().multiplyScalar(.2 * patternScale)
        if (perlin.get3(noisePos) < 0) clr = clr.lerp(new THREE.Color(0xff0000), .3)
        noisePos.add(new THREE.Vector3(0,0,100))
        if (perlin.get3(noisePos) < 0) clr = clr.lerp(new THREE.Color(0x00ff00), .3)
        noisePos.add(new THREE.Vector3(100,0,0))
        if (perlin.get3(noisePos) < 0) clr = clr.lerp(new THREE.Color(0x0000ff), .3)
        return clr
    },
    gradient: (pos) => {
        const v = pos.y / 5
        const clr = clr1.clone().lerp(clr2, v)
        return clr
    }
}

export function prepareGeometryColors(geometry){
    const position = geometry.attributes.position
    const colors = []
    for (let i = 0; i < position.count; i++) {
        const pos = new THREE.Vector3(position.getX(i), position.getY(i), position.getZ(i))
        const clr = getColor(pos)
        colors.push(clr.r, clr.g, clr.b)
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
}
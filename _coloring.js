import * as THREE from 'three';
import { choose, perlin, random } from './utils';

export const colors = [
    'lightgreen',
    'lightblue',
    'pink',
    'orange',
    'yellow',
    'hotpink',
    'mediumpurple',
    'cornflowerblue',
    'coral',
    'white'
]


let clr1 = null
let clr2 = null
export let colorPattern = null
let patternScale = 1
export function initColoring() {
    const duoColor = random() < .5

    clr1 = choose(colors)
    clr2 = choose(colors)
    if (random() < 0.2) clr2 = choose(colors)

    clr1 = new THREE.Color(clr1)
    clr2 = new THREE.Color(clr2)

    if (duoColor) colorPattern = choose([
        pattern_zebra, pattern_stripes, pattern_cow,
        pattern_cameo, pattern_gradient
    ])
    else colorPattern = patten_none

    colorPattern = new colorPattern()
    patternScale = random(.5, 1.5)
}

export function getColor(pos) {
    return colorPattern.get(pos)
}


function patten_none() {
    this.name = null
    this.get = (pos) => {
        return clr1
    }
}
function pattern_zebra() {
    this.name = 'Zebra'
    this.zebraScaler = choose([
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 1),
    ])
    if (random() < 0.5) this.zebraScaler = new THREE.Vector3(random(-1, 1), random(-1, 1), random(-1, 1))
    this.zebraScaler = this.zebraScaler.normalize().multiplyScalar(random(5, 10))

    this.get = (pos) => {
        let clrNoisePos = pos.clone().multiplyScalar(.2 * patternScale)
        clrNoisePos = clrNoisePos.multiply(this.zebraScaler)
        const clrNoise = perlin.get3(clrNoisePos);
        let clr = clr1
        if (clrNoise < -.2) clr = clr2
        // else if (clrNoise < .2) {
        //     const v = (clrNoise + .2) / .4
        //     clr = clr2.lerp(clr1, v)
        // }
        return clr
    }
}
function pattern_stripes() {
    this.name = 'Stripes'
    this.getV = choose([
        (pos) => Math.abs(pos.x) + Math.abs(pos.y) + Math.abs(pos.z),
        (pos) => Math.abs(pos.x) + Math.abs(pos.y),
        (pos) => Math.abs(pos.x) + Math.abs(pos.z),
        (pos) => Math.abs(pos.y) + Math.abs(pos.z),
        (pos) => Math.abs(pos.x),
        (pos) => Math.abs(pos.y),
        (pos) => Math.abs(pos.z),
    ])
    this.scale = random(5, 15)

    this.get = (pos) => {
        const patternPos = pos.clone().multiplyScalar(.2)
        let v = this.getV(patternPos)
        v *= this.scale * patternScale
        let clr = clr1
        if (v % 2 < 1) clr = clr2
        return clr
    }
}
function pattern_cow() {
    this.name = 'Hide'
    this.get = (pos) => {
        const patternPos = pos.clone().multiplyScalar(.2 * patternScale)
        const v = perlin.get3(patternPos)
        let clr = clr1
        if (v < 0) clr = clr2
        return clr
    }
}
function pattern_cameo() {
    this.name = 'Vibrant'
    this.get = (pos) => {
        let clr = new THREE.Color(0xffffff)
        let noisePos = pos.clone().add(new THREE.Vector3(1000,1000,1000)).multiplyScalar(.2 * patternScale)
        if (perlin.get3(noisePos) < 0) clr = clr.lerp(new THREE.Color(0xff0000), .5)
        noisePos.add(new THREE.Vector3(0, 0, 100))
        if (perlin.get3(noisePos) < 0) clr = clr.lerp(new THREE.Color(0x00ff00), .5)
        noisePos.add(new THREE.Vector3(100, 0, 0))
        if (perlin.get3(noisePos) < 0) clr = clr.lerp(new THREE.Color(0x0000ff), .5)
        return clr
    }
}
function pattern_gradient() {
    this.name = 'Gradient'
    this.get = (pos) => {
        const v = pos.y / 5
        const clr = clr1.clone().lerp(clr2, v)
        return clr
    }
}

export function prepareGeometryColors(geometry) {
    const position = geometry.attributes.position
    const colors = []
    for (let i = 0; i < position.count; i++) {
        const pos = new THREE.Vector3(position.getX(i), position.getY(i), position.getZ(i))
        const clr = getColor(pos)
        colors.push(clr.r, clr.g, clr.b)
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
}
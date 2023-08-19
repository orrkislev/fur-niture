import { Perlin } from 'three-noise';

export const random = (a = 0, b = 1) => a + Math.random() * (b - a)
export const choose = arr => arr[Math.floor(random() * arr.length)]

export const perlin = new Perlin(random());

const frameFuncs = []
export function addFrameFunc(func) {
    frameFuncs.push(func)
}

export function runFrameFuncs() {
    const time = performance.now() / 1000
    frameFuncs.forEach(func => func(time))
}
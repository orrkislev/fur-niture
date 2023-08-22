import * as THREE from 'three'
import { fur, furBaseMaterial } from '../fur.js'
import { random } from '../utils.js'

export function ottoman() {
    const shape = new THREE.Shape()
    const r1 = random() < .5 ? 1 : random(1,10)
    const r2 = random() < .5 ? 3 : random(3,10)
    const w = random() < .5 ? 20 : random(10,30)
    const h = random() < .5 ? 20 : random(10,30)
    shape.moveTo(0, 0)
    shape.lineTo(w - r1, 0)
    shape.quadraticCurveTo(w, 0, w, r1)
    shape.lineTo(w, h - r2)
    shape.quadraticCurveTo(w, h, w - r2, h)
    shape.lineTo(0, h)

    const lathPts = shape.getSpacedPoints(100)
    lathPts.forEach(pt => pt.multiplyScalar(.5))
    const lathGeom = new THREE.LatheGeometry(lathPts, 100)
    const lathMesh = new THREE.Mesh(lathGeom, furBaseMaterial)
    lathMesh.castShadow = true
    lathMesh.receiveShadow = true

    fur(lathMesh, 200 * 1000)
}
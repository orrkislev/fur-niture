import * as THREE from 'three'
import { fur, furBaseMaterial } from '../fur.js'

export function ottoman() {
    const shape = new THREE.Shape()
    const r1 = 1
    const r2 = 3
    const w = 20
    const h = 20
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
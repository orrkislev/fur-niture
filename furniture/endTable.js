import * as THREE from 'three'
import { fur, furBaseMaterial } from '../fur.js'

export function endTable() {
    const path = new THREE.Path()
    path.moveTo(0, 0)
    path.lineTo(1, 0)
    path.arc(0, 4, 4, -Math.PI / 2, 0)
    path.bezierCurveTo(4, 6, 1, 9, 1, 11)
    path.lineTo(1, 35)
    path.lineTo(15, 35)
    path.arc(0, 1, 1, -Math.PI / 2, Math.PI / 2)
    path.lineTo(0, 37)


    const lathPts = path.getSpacedPoints(100)
    lathPts.forEach(pt => pt.multiplyScalar(.5))
    const lathGeom = new THREE.LatheGeometry(lathPts, 100)
    const lathMesh = new THREE.Mesh(lathGeom, furBaseMaterial)
    lathMesh.castShadow = true
    lathMesh.receiveShadow = true

    fur(lathMesh, 80 * 1000)
}

export function lamp() {
    const path = new THREE.Path()
    path.moveTo(0, 0)
    path.lineTo(1, 0)
    path.arc(0, 4, 4, -Math.PI / 2, 0)
    path.bezierCurveTo(4, 6, 1, 9, 1, 11)
    path.lineTo(1, 20)
    path.lineTo(6, 20)
    path.lineTo(6, 50)
    path.lineTo(0, 50)


    const lathPts = path.getSpacedPoints(100)
    lathPts.forEach(pt => pt.multiplyScalar(.5))
    const lathGeom = new THREE.LatheGeometry(lathPts, 100)
    const lathMesh = new THREE.Mesh(lathGeom, furBaseMaterial)
    lathMesh.castShadow = true
    lathMesh.receiveShadow = true

    fur(lathMesh, 80 * 1000)
}
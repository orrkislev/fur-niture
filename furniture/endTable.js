import * as THREE from 'three'
import { fur, furBaseMaterial } from '../fur.js'
import { random } from '../utils.js'

export function endTable() {
    const neckLength = 25 // random(10,30)
    const dishR = 15 // random(8,24)
    const dishThickness = .5 // random(.2,1.5)

    const path = new THREE.Path()
    path.moveTo(0, 0)
    path.lineTo(1, 0)
    path.arc(0, 4, 4, -Math.PI / 2, 0)
    path.bezierCurveTo(4, 6, 1, 9, 1, 11)
    path.lineTo(1, 11 + neckLength)
    path.lineTo(dishR, 11 + neckLength)
    path.arc(0, dishThickness, dishThickness, -Math.PI / 2, Math.PI / 2)
    path.lineTo(0, path.currentPoint.y)


    const lathPts = path.getSpacedPoints(100)
    lathPts.forEach(pt => pt.multiplyScalar(.5))
    const lathGeom = new THREE.LatheGeometry(lathPts, 100)
    const lathMesh = new THREE.Mesh(lathGeom, furBaseMaterial)
    lathMesh.castShadow = true
    lathMesh.receiveShadow = true

    fur(lathMesh, 80 * 1000)
}

export function lamp() {
    const lampR = 5 // random(3,3)
    const lampH = 28 // random(20,70)

    const path = new THREE.Path()
    path.moveTo(0, 0)
    path.lineTo(1, 0)
    path.arc(0, 4, 4, -Math.PI / 2, 0)
    path.bezierCurveTo(4, 6, 1, 9, 1, 11)
    path.lineTo(1, 20)
    path.lineTo(lampR, 20)
    path.lineTo(lampR, 20+lampH)
    path.lineTo(0, 20+lampH)


    const lathPts = path.getSpacedPoints(100)
    lathPts.forEach(pt => pt.multiplyScalar(.5))
    const lathGeom = new THREE.LatheGeometry(lathPts, 100)
    const lathMesh = new THREE.Mesh(lathGeom, furBaseMaterial)
    lathMesh.castShadow = true
    lathMesh.receiveShadow = true

    fur(lathMesh, 80 * 1000)
}
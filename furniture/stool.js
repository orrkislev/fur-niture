import * as THREE from "three";
import { fur, furBaseMaterial } from "../fur";

export function stool() {
    const shape = new THREE.Shape()
    const r1 = .5
    const r2 = .5
    const w = 8
    const h = 3
    shape.moveTo(0, 0)
    shape.lineTo(w - r1, 0)
    shape.quadraticCurveTo(w, 0, w, r1)
    shape.lineTo(w, h - r2)
    shape.quadraticCurveTo(w, h, w - r2, h)
    shape.lineTo(0, h)

    const lathPts = shape.getSpacedPoints(100)
    lathPts.forEach(pt => pt.multiplyScalar(.5))
    const lathGeom = new THREE.LatheGeometry(lathPts, 100)
    lathGeom.translate(0,10,0)
    const top = new THREE.Mesh(lathGeom, furBaseMaterial)
    top.castShadow = true
    top.receiveShadow = true

    // const top = new THREE.Mesh(
    //     new THREE.CylinderGeometry(4, 4, 2, 32),
    //     furBaseMaterial
    // )
    // top.castShadow = true
    // scene.add(top)

    const legGeo1 = new THREE.CylinderGeometry(.5, .5, 11)
    legGeo1.translate(3, 5, 0)
    legGeo1.rotateZ(.1)
    const leg = new THREE.Mesh(legGeo1, furBaseMaterial)
    leg.castShadow = true

    const legGeo2 = legGeo1.clone()
    legGeo2.rotateZ(-.2)
    legGeo2.translate(-6, 0, 0)
    const leg2 = new THREE.Mesh(legGeo2, furBaseMaterial)
    leg2.castShadow = true

    const legGeo3 = legGeo1.clone()
    legGeo3.rotateZ(-.1)
    legGeo3.rotateX(-.1)
    legGeo3.translate(-3, 0, 3)
    const leg3 = new THREE.Mesh(legGeo3, furBaseMaterial)
    leg3.castShadow = true

    const legGeo4 = legGeo3.clone()
    legGeo4.rotateX(.2)
    legGeo4.translate(0, 0, -6)
    const leg4 = new THREE.Mesh(legGeo4, furBaseMaterial)
    leg4.castShadow = true

    const bracerGeo1 = new THREE.CylinderGeometry(.5, .5, 4.5)
    bracerGeo1.rotateX(Math.PI / 2)
    bracerGeo1.rotateY(-Math.PI / 4)
    bracerGeo1.translate(1.35, 3, 1.35)
    const bracer1 = new THREE.Mesh(bracerGeo1, furBaseMaterial)
    bracer1.castShadow = true

    const bracerGeo2 = bracerGeo1.clone()
    bracerGeo2.translate(-2.7,0,-2.7)
    const bracer2 = new THREE.Mesh(bracerGeo2, furBaseMaterial)
    bracer2.castShadow = true
    // const bracer2 = bracer1.clone()
    // bracer2.position.set(-1.6, 3, 1.6)

    const bracerGeo3 = bracerGeo1.clone()
    bracerGeo3.rotateY(-Math.PI / 2)
    // bracerGeo3.translate(-3.2, 0, 0)
    const bracer3 = new THREE.Mesh(bracerGeo3, furBaseMaterial)
    bracer3.castShadow = true
    // const bracer3 = bracer1.clone()
    // bracer3.rotateZ(-Math.PI / 2)
    // bracer3.position.set(-1.6, 3, -1.6)

    const bracerGeo4 = bracerGeo1.clone()
    bracerGeo4.rotateY(Math.PI / 2)
    const bracer4 = new THREE.Mesh(bracerGeo4, furBaseMaterial)
    bracer4.castShadow = true
    // const bracer4 = bracer3.clone()
    // bracer4.position.set(1.6, 3, 1.6)

    fur(top,  40 * 1000)
    fur(leg,  20 * 1000)
    fur(leg2, 20 * 1000)
    fur(leg3, 20 * 1000)
    fur(leg4, 20 * 1000)
    fur(bracer1, 10 * 1000)
    fur(bracer2, 10 * 1000)
    fur(bracer3, 10 * 1000)
    fur(bracer4, 10 * 1000)
}
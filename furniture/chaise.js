import * as THREE from 'three';
import { scene } from '../setups.js';
import { fur, furBaseMaterial } from '../fur.js';

export function chaise() {

    const legCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-5, 0, 0),
        new THREE.Vector3(-5, 1, 0),
        new THREE.Vector3(-4, 5, 0),
        new THREE.Vector3(0, 7, 0),
        new THREE.Vector3(10, 5, 0),
        new THREE.Vector3(20, 15, 0),
    ])
    const startSitting = .1
    const legCurvePoints = []
    for (let i = startSitting; i <= 1; i += .01)
        legCurvePoints.push(legCurve.getPointAt(i))
    const sittingCurve = new THREE.CatmullRomCurve3(legCurvePoints)

    const legPos = .8
    const legBack1 = legCurve.getPointAt(legPos)
    const legBackT = legCurve.getTangentAt(legPos).cross(new THREE.Vector3(0, 0, 1))
    const legBack2 = legBack1.clone().add(legBackT.clone().multiplyScalar(1.5))
    const legBack3 = legBack2.clone()
    legBack3.y = 0
    const legBackCrv = new THREE.CatmullRomCurve3([
        legBack1,
        legBack2,
        new THREE.Vector3(legBack3.x, 1, legBack3.z),
        legBack3,
    ])

    const chaiseThickness = .5
    const chaiseWidth = 6

    const geometry = extrude(sittingCurve, makeChaiseShape(chaiseWidth, 0, chaiseThickness))
    const mesh = new THREE.Mesh(geometry, furBaseMaterial);
    mesh.castShadow = true
    mesh.translateY(chaiseThickness + .2)

    fur(mesh, 200 * 1000)

    const legGeometry = extrude(legCurve, makeChaiseShape(.5, 0, .1))
    const material2 = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const legMesh = new THREE.Mesh(legGeometry, material2);
    legMesh.castShadow = true
    legMesh.translateZ(chaiseWidth - .5)
    scene.add(legMesh);

    const legMesh2 = legMesh.clone()
    legMesh2.translateZ(-chaiseWidth * 2 + 1)
    scene.add(legMesh2);

    const legBackGeometry = extrude(legBackCrv, makeChaiseShape(.5, 0, .1))
    const legBackMesh = new THREE.Mesh(legBackGeometry, material2);
    legBackMesh.castShadow = true
    legBackMesh.translateZ(chaiseWidth - .5)
    scene.add(legBackMesh);

    const legBackMesh2 = legBackMesh.clone()
    legBackMesh2.translateZ(-chaiseWidth * 2 + 1)
    scene.add(legBackMesh2);
}

export function extrude(path, shape) {
    return new THREE.ExtrudeGeometry(shape, {
        steps: Math.round(path.getLength() * 2),
        extrudePath: path,
    });
}


function makeChaiseShape(w, h, r) {
    const shape = new THREE.Shape();
    shape.moveTo(-w, h);
    shape.bezierCurveTo(-w, h + r / 2, -w + r / 2, h + r, -w + r, h + r);
    shape.lineTo(w - r, h + r);
    shape.bezierCurveTo(w - r / 2, h + r, w, h + r / 2, w, h);
    shape.lineTo(w, -h);
    shape.bezierCurveTo(w, -h - r / 2, w - r / 2, -h - r, w - r, -h - r);
    shape.lineTo(-w + r, -h - r);
    shape.bezierCurveTo(-w + r / 2, -h - r, -w, -h - r / 2, -w, -h);

    if (shape.getLength() > 24){
        const shapePoints = shape.getSpacedPoints(100)
        return new THREE.Shape(shapePoints)
    }
    return shape
}
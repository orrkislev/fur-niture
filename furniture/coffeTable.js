import * as THREE from 'three'
import { fur, furBaseMaterial } from '../fur.js';

export default function coffeTable(){
    const crv = new THREE.SplineCurve([
        new THREE.Vector2(-12, 2),
        new THREE.Vector2(-8,5),
        new THREE.Vector2(-1,5),
        new THREE.Vector2(4.5, 7.7),
        new THREE.Vector2(7.6, 3.3),
        new THREE.Vector2(12.8, 0.9),
        new THREE.Vector2(10.2, -5.4),
        new THREE.Vector2(3, -3.5),
        new THREE.Vector2(-3.7, -5.4),
        new THREE.Vector2(-10.2, -4.4),
        new THREE.Vector2(-12, 2),
    ])

    // make shape from curve
    const shape = new THREE.Shape(crv.getPoints(300))
    const extrudeSettings = {
        steps: 100,
        depth: 5,
        bevelEnabled: true,
        bevelThickness: 3,
        bevelSize: 5,
        bevelOffset: 0,
        bevelSegments: 30
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.rotateX(Math.PI / 2)
    geometry.translate(0, 10, 0)
    const mesh = new THREE.Mesh(geometry, furBaseMaterial);
    mesh.castShadow = true
    mesh.scale.set(.5,.5,.5)

    const legGeo = new THREE.CylinderGeometry(3, 3, 3, 32)
    legGeo.translate(0, 1.5, 0)
    const leg1 = new THREE.Mesh(legGeo,furBaseMaterial)
    leg1.position.set(-5, 0, -1.25)
    leg1.scale.set(.5,.5,.5)

    const leg2 = leg1.clone()
    leg2.position.set(5, 0, -1)

    const leg3 = leg1.clone()
    leg3.position.set(1.8, 0, 2.1)

    fur(mesh, 200 * 1000)
    fur(leg1, 20 * 1000)
    fur(leg2, 20 * 1000)
    fur(leg3, 20 * 1000)
}
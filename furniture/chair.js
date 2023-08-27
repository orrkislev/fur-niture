import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { fur, furBaseMaterial } from '../fur';
import { scene } from '../setups';
import { random } from '../utils';

export async function chair() {

    const legPath = new THREE.Shape();
    const bottomW = 20
    const topW = 15
    const legH = 15
    const cornerRadius = 1
    legPath.moveTo(0, 0)
    legPath.lineTo(bottomW/2 - cornerRadius, 0)
    legPath.quadraticCurveTo(bottomW/2, 0, bottomW/2, cornerRadius)
    legPath.lineTo(topW/2, legH-cornerRadius)
    legPath.quadraticCurveTo(topW/2, legH, topW/2-cornerRadius, legH)
    legPath.lineTo(0, legH)

    const legPathPoints = legPath.getPoints(100)
    const legCurve = new THREE.CatmullRomCurve3(
        legPathPoints.map(p => new THREE.Vector3(p.x, p.y, 0))
    )


    const legExtrudeShape = new THREE.Shape();
    legExtrudeShape.arc(0, 0, .3, 0, Math.PI / 2, true)

    const extrudeSettings = {
        steps: 100,
        extrudePath: legCurve,
    };

    const geometry = new THREE.ExtrudeGeometry(legExtrudeShape, extrudeSettings);
    const leg1 = new THREE.Mesh(geometry, furBaseMaterial);
    leg1.castShadow = true
    leg1.rotateY(Math.PI / 4)
    scene.add(leg1);

    const leg2 = leg1.clone()
    leg2.rotateY(Math.PI/2)
    scene.add(leg2);

    const leg3 = leg2.clone()
    leg3.rotateY(Math.PI/2)
    scene.add(leg3);

    const leg4 = leg3.clone()
    leg4.rotateY(Math.PI/2)
    scene.add(leg4);


    const loader = new OBJLoader();
    const model = await loader.loadAsync('furniture/chair.obj');
    model.children.forEach(child => {
        const geometry = child.geometry;
        const mesh = new THREE.Mesh(geometry, furBaseMaterial);
        mesh.scale.set(4, 4, 4)

        mesh.castShadow = true
        fur(mesh, 100 * 1000)

        const box = new THREE.Box3().setFromObject(mesh);
        const boxSize = box.getSize(new THREE.Vector3())
    })

    scene.rotateY(random() < .5 ? -3 * Math.PI / 4 : -Math.PI / 4)
}
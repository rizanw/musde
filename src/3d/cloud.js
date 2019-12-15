import * as THREE from "three";
import { Colors } from '../conf.js';

export class Cloud {
    constructor() {
        this.mesh = new THREE.Object3D();
        this.mesh.name = "cloud";
        var geom = new THREE.CubeGeometry(10, 10, 10);
        var mat = new THREE.MeshPhongMaterial({
            color: Colors.white,
        });

        var nBlocs = 3 + Math.floor(Math.random() * 3);
        for (var i = 0; i < nBlocs; i++) {
            var m = new THREE.Mesh(geom.clone(), mat);
            m.position.x = Math.random(0) * 10;
            m.position.y = 25;
            m.position.z = Math.random() * 10;
            m.rotation.z = Math.random() * Math.PI * 2;
            m.rotation.y = Math.random() * Math.PI * 2;
            var s = .7 + Math.random() * 10;
            m.scale.set(s, s, s);
            this.mesh.add(m);
            m.castShadow = true;
            m.receiveShadow = true;
        }
    }

    rotate () {
        var l = this.mesh.children.length;
        for (var i = 0; i < l; i++) {
            var m = this.mesh.children[i];
            m.rotation.z += Math.random() * .005 * (i + 1);
            m.rotation.y += Math.random() * .002 * (i + 1);
        }
    }
}
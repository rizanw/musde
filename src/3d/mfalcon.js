import * as THREE from "../lib/three.module.js";
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/loaders/GLTFLoader.js';
import { scene } from "../index.js";

export function mfalcon() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = "destroyerPlane";

    var loader = new GLTFLoader().setPath("/src/gltf/mfalcon/");
    loader.load("mfalcon.gltf", (gltf) => {
        var sps = gltf.scene;
        sps.name = 'Plane';

        this.mesh.add(sps);
    });
}
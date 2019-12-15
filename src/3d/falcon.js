import * as THREE from "three";
import GLTFLoader from "../util/GLTFLoader";

export class Falcon {
    constructor() {
        this.mesh = new THREE.Object3D();

        var loader = new GLTFLoader();
        loader.load("/3d/mfalcon/mfalcon.gltf", (gltf) => {
            var sc = gltf.scene;
            sc.name = 'Plane';

            this.mesh.add(sc);
        });
    }
}
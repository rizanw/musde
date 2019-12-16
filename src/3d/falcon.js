import * as THREE from "three";
import GLTFLoader from "../util/GLTFLoader";
import { Colors } from "../conf";

export class Falcon {
    constructor() {
        this.mesh = new THREE.Object3D();
        var matSilver = new THREE.MeshPhongMaterial({color: Colors.jetblack})
        var matBlue = new THREE.MeshPhongMaterial({color: Colors.blue, shininess: 100, emissive: Colors.blue});

        var light = new THREE.PointLight(Colors.blue);

        var loader = new GLTFLoader();
        loader.load("/3d/mfalcon/mfalcon.gltf", (gltf) => {
            var sc = gltf.scene;
            sc.name = 'Plane';
            
            sc.traverse((o) => {
                if (o.isMesh){
                    o.castShadow = true;

                    if(o.material.name == "Engine02") {             
                        o.material = matBlue;
                    } else {
                        o.material = matSilver;
                    }

                }
            });

            this.mesh.add(sc);
        });        
    }
}
import * as THREE from "three";
import { game } from '../conf.js';
import { audioWarp, scene} from '../index';
import sleep from '../util/sleep.js';

export class Planet {
    constructor() {   
        this.planets = ['hoth', 'terracatur'];
        this.planetIdx = 0;
        this.geom = new THREE.SphereGeometry(game.planetRadius, 64, 64);
        // geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 100, 0));

        this.loader = new THREE.TextureLoader();
        this.mat = new THREE.MeshPhongMaterial({
            map: this.loader.load('/texture/hoth.png')
        });

        this.mesh = new THREE.Mesh(this.geom, this.mat);
        this.mesh.name = "earth";
        this.mesh.receiveShadow = true;
    }

    rotate(deltaTime) {
        this.mesh.rotation.z += game.speed * deltaTime;

        if (this.mesh.rotation.z > 2 * Math.PI) this.mesh.rotation.z -= 2 * Math.PI;
    }

    swap_texture(){
        this.planetIdx = (this.planetIdx+1) % this.planets.length;

        this.loader.load(`/texture/${this.planets[this.planetIdx]}.png`, (map) => {
            this.mat.map = map;
        });
    }

    async transition() {
        audioWarp.play();
        for(let i=0; i<10; i++){
            await sleep(200);
            
            for(let it of scene.children) {
                if(it.name == 'Pointy'){
                    it.intensity += 0.1;
                    console.log(it.intensity);
                }
            }
        }
        this.swap_texture();
        for(let i=0; i<10; i++){
            await sleep(200);
            
            for(let it of scene.children) {
                if(it.name == 'Pointy'){
                    it.intensity -= 0.1;
                    console.log(it.intensity);
                }
            }
        }
    }
}
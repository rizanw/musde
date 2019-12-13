import * as THREE from '../lib/three.module.js';
import { game } from '../conf.js';

export function Hoth() {
    
    var geom = new THREE.SphereGeometry(game.seaRadius, 64, 64);
    // geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 100, 0));

    var loader = new THREE.TextureLoader();
    var mat = new THREE.MeshBasicMaterial({
        map: loader.load('/src/texture/hoth.png')
    });

    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.name = "earth";
    this.mesh.receiveShadow = true;
}

Hoth.prototype.rotate = function (deltaTime) {
    // this.mesh.position = {-20;
    this.mesh.rotation.z += game.speed * deltaTime;

    if (this.mesh.rotation.z > 2 * Math.PI) this.mesh.rotation.z -= 2 * Math.PI;
}

Hoth.prototype.moveWaves = function (deltaTime) {
    return 0
}
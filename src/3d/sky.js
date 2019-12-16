import * as THREE from "three";
import { Cloud } from './cloud.js';
import { game } from '../conf.js';

export class Sky {
    constructor() {
        this.mesh = new THREE.Object3D();
        this.nClouds = 200;
        this.clouds = [];
        var stepAngle = Math.PI * 2 / this.nClouds;
        for (var i = 0; i < this.nClouds; i++) {
            var c = new Cloud();
            this.clouds.push(c);
            var a = stepAngle * i;
            var h = game.planetRadius;
            c.mesh.position.y = Math.sin(a) * h;
            c.mesh.position.x = Math.cos(a) * h;
            c.mesh.position.z = Math.random() * h - h/2;
            c.mesh.rotation.z = a + Math.PI / 2;
            var s = 1 + Math.random() * 2;
            c.mesh.scale.set(s, s, s);
            this.mesh.add(c.mesh);
        }
    }

    moveClouds(deltaTime) {
        for (var i = 0; i < this.nClouds; i++) {
            var c = this.clouds[i];
            c.rotate();
        }
        this.mesh.rotation.z += game.speed * deltaTime;
    }
}
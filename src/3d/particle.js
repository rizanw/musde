import * as THREE from "three";
import { particlesPool } from '../index.js';

var particlesInUse = [];

export function Particle() {
    var geom = new THREE.TetrahedronGeometry(3, 0);
    var mat = new THREE.MeshPhongMaterial({
        color: 0x009999,
        shininess: 0,
        specular: 0xffffff,
        shading: THREE.FlatShading
    });
    this.mesh = new THREE.Mesh(geom, mat);
}

Particle.prototype.explode = function (pos, color, scale) {
    var _this = this;
    var _p = this.mesh.parent;
    this.mesh.material.color = new THREE.Color(color);
    this.mesh.material.needsUpdate = true;
    this.mesh.scale.set(scale, scale, scale);
    _p.remove(_this.mesh);
}

export function ParticlesHolder() {
    this.mesh = new THREE.Object3D();
    this.particlesInUse = [];
}

ParticlesHolder.prototype.spawnParticles = function (pos, density, color, scale) {
    var nPArticles = density;
    for (var i = 0; i < nPArticles; i++) {
        var particle;
        if (particlesPool.length) {
            particle = particlesPool.pop();
        } else {
            particle = new Particle();
        }
        this.mesh.add(particle.mesh);
        particle.mesh.visible = true;
        var _this = this;
        particle.mesh.position.y = pos.y;
        particle.mesh.position.x = pos.x;
        particle.mesh.position.z = pos.z;
        particle.explode(pos, color, scale);
    }
}
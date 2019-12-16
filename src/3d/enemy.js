import * as THREE from "three";
import { game, Colors } from '../conf.js';
import { airplane, enemiesPool, removeEnergy, decreaseHealth, particlesHolder, ambientLight } from '../index.js';

export class Enemy {
    constructor() {
        var geom = new THREE.TetrahedronGeometry(8, 2);
        var mat = new THREE.MeshPhongMaterial({
            color: Colors.red,
            shininess: 0,
            specular: 0xffffff,
            flatShading: THREE.FlatShading
        });
        this.mesh = new THREE.Mesh(geom, mat);
        this.mesh.castShadow = true;
        this.angle = 0;
        this.dist = 0;
    }
}

export class EnemiesHolder {
    constructor() {
        this.mesh = new THREE.Object3D();
        this.enemiesInUse = [];
    }

    spawnEnemies() {
        var nEnemies = game.level;

        for (var i = 0; i < nEnemies; i++) {
            var enemy;
            if (enemiesPool.length) {
                enemy = enemiesPool.pop();
            } else {
                enemy = new Enemy();
            }

            enemy.angle = - (i * 0.1);
            enemy.distance = game.planetRadius + game.planeDefaultHeight + (-1 + Math.random() * 2) * (game.planeAmpHeight - 20);
            enemy.mesh.position.y = -game.planetRadius + Math.sin(enemy.angle) * enemy.distance;
            enemy.mesh.position.x = Math.cos(enemy.angle) * enemy.distance;
            enemy.mesh.position.z = Math.floor(Math.random() * 201) - 100;

            this.mesh.add(enemy.mesh);
            this.enemiesInUse.push(enemy);
        }
    }

    rotateEnemies(deltaTime) {
        for (var i = 0; i < this.enemiesInUse.length; i++) {
            var enemy = this.enemiesInUse[i];
            enemy.angle += game.speed * deltaTime * game.enemiesSpeed;

            if (enemy.angle > Math.PI * 2) enemy.angle -= Math.PI * 2;

            enemy.mesh.position.y = -game.planetRadius + Math.sin(enemy.angle) * enemy.distance;
            enemy.mesh.position.x = Math.cos(enemy.angle) * enemy.distance;
            enemy.mesh.rotation.z += Math.random() * .1;
            enemy.mesh.rotation.y += Math.random() * .1;

            //var globalEnemyPosition =  enemy.mesh.localToWorld(new THREE.Vector3());
            var diffPos = airplane.mesh.position.clone().sub(enemy.mesh.position.clone());
            var d = diffPos.length();
            if (d < game.enemyDistanceTolerance) {
                particlesHolder.spawnParticles(enemy.mesh.position.clone(), 15, Colors.red, 3);

                enemiesPool.unshift(this.enemiesInUse.splice(i, 1)[0]);
                this.mesh.remove(enemy.mesh);
                game.planeCollisionSpeedX = 100 * diffPos.x / d;
                game.planeCollisionSpeedY = 100 * diffPos.y / d;
                ambientLight.intensity = 2;

                removeEnergy();
                decreaseHealth();
                i--;
            } else if (enemy.angle > Math.PI) {
                enemiesPool.unshift(this.enemiesInUse.splice(i, 1)[0]);
                this.mesh.remove(enemy.mesh);
                i--;
            }
        }
    }
}
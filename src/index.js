import * as THREE from "three";
import { Colors, game, resetGame } from './conf';
import { Sky } from './3d/sky';
import { Particle, ParticlesHolder } from './3d/particle';
import { CoinsHolder } from './3d/coin';
import { Enemy, EnemiesHolder } from './3d/enemy';
import { Falcon } from './3d/falcon';
import { Planet } from './3d/planet';
import { handleHandPos, isHandDetected, handleHandState } from './util/leap';
import * as Leap from 'leapjs';
import { AudioJam } from './util/audio';
import { addData, displayTopSeven } from './util/iDB';

// GAME VARIABLES
var deltaTime = 0;
var newTime = new Date().getTime();
var oldTime = new Date().getTime();
export var enemiesPool = [];
export var particlesPool = [];

//THREEJS RELATED VARIABLES
export var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer,
    container,
    controls;

//SCREEN & MOUSE VARIABLES
var HEIGHT, WIDTH, mousePos = { x: 0, y: 0 }, handPos = { x: 0, y: 0 };

//INIT THREE JS, SCREEN AND MOUSE EVENTS
function createScene() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    scene = new THREE.Scene();
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 50;
    nearPlane = .1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    scene.fog = new THREE.Fog(0xffffff,800, 950);
    camera.position.x = -200;
    camera.position.z = 0;
    camera.position.y = game.planeDefaultHeight - 50;
    camera.lookAt(new THREE.Vector3(100, 0, 0));
    // console.log("sumbu y " + camera.position.y);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;

    container = document.getElementById('world');
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', handleWindowResize, false);

    /*
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minPolarAngle = -Math.PI / 2;
    controls.maxPolarAngle = Math.PI ;
  
    //controls.noZoom = true;
    //controls.noPan = true;
    //*/
}

// MOUSE AND SCREEN EVENTS
function handleWindowResize() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

function handleMouseMove(event) {
    var tx = -1 + (event.clientX / WIDTH) * 2;
    var ty = 1 - (event.clientY / HEIGHT) * 2;
    mousePos = { x: tx, y: ty };
    // console.log(mousePos);
}

function handleTouchMove(event) {
    event.preventDefault();
    var tx = -1 + (event.touches[0].pageX / WIDTH) * 2;
    var ty = 1 - (event.touches[0].pageY / HEIGHT) * 2;
    mousePos = { x: tx, y: ty };
}

function handleMouseUp(event) {
    if (game.status == "waitingReplay") {
        resetGame();
        hideScoreBoard();
        hideReplay();
    }
}

function handleTouchEnd(event) {
    if (game.status == "waitingReplay") {
        resetGame();
        hideScoreBoard();
        hideReplay();
    }
}

function handleHandGrab(frame) {
    if (game.status == "waitingReplay") {
        if (frame.hands.length > 0) {
            var hand = frame.hands[0];

            if (handleHandState(hand, 10) == "opening") {
                resetGame();
                hideScoreBoard();
                hideReplay();
            }
        }
    }
}

function handleHandMove(frame) {
    var temp = mousePos;
    if (isHandDetected(frame)) {
        mousePos = handleHandPos(frame, temp);
    }
}

// LIGHTS
export var ambientLight, hemisphereLight, shadowLight;
function createLights() {
    hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, .2)
    ambientLight = new THREE.AmbientLight(0xa3e5ff, .5);

    shadowLight = new THREE.DirectionalLight(0xffffff, .6);
    shadowLight.position.set(150, 350, 350);
    shadowLight.castShadow = true;
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;
    shadowLight.shadow.mapSize.width = 4096;
    shadowLight.shadow.mapSize.height = 4096;

    var ch = new THREE.CameraHelper(shadowLight.shadow.camera);
    // scene.add(ch);

    var pointyLight = new THREE.PointLight(0xffffff, 0.1, 0, 1);
    pointyLight.name = "Pointy";
    pointyLight.position.set(0, 0, 0);
    scene.add(pointyLight);
    scene.add(hemisphereLight);
    scene.add(shadowLight);
    scene.add(ambientLight);
}


function updateDistance() {
    game.distance += game.speed * deltaTime * game.ratioSpeedDistance;
    fieldDistance.innerHTML = Math.floor(game.distance);
    var d = 502 * (1 - (game.distance % game.distanceForLevelUpdate) / game.distanceForLevelUpdate);
}

function updateDebris() {
    fieldDebris.innerHTML = Math.floor(game.coinCollected);
}

// TOOLS
function normalize(v, vmin, vmax, tmin, tmax) {
    var nv = Math.max(Math.min(v, vmax), vmin);
    var dv = vmax - vmin;
    var pc = (nv - vmin) / dv;
    var dt = tmax - tmin;
    var tv = tmin + (pc * dt);

    return tv;
}

function updateEnergy() {
    game.energy -= game.speed * deltaTime * game.ratioSpeedEnergy;
    game.energy = Math.max(0, game.energy);
    energyBar.style.right = (100 - game.energy) + "%";
    energyBar.style.backgroundColor = (game.energy < 50) ? "#f25346" : "#68c3c0";
    if (game.energy < 30) {
        energyBar.style.animationName = "blinking";
    } else {
        energyBar.style.animationName = "none";
    }
    if (game.energy < 1) {
        game.status = "gameover";
    }
}
export function addEnergy() {
    game.coinCollected += 1;
    game.energy += game.coinValue;
    game.energy = Math.min(game.energy, 100);
}
export function removeEnergy() {
    game.energy -= game.enemyValue;
    game.energy = Math.max(0, game.energy);
}

function updateHealth() { 
    healthBar.style.left = (100 - game.health) + "%";
    healthBar.style.backgroundColor = (game.health < 50) ? "#f25346" : "#68c3c0";
    if (game.health < 30) {
        healthBar.style.animationName = "blinking";
    } else {
        healthBar.style.animationName = "none";
    }
    if (game.health < 1) {
        game.status = "gameover";
    }
}
export function decreaseHealth() {
    game.health -= Math.floor(Math.random() * 30) + 10;
}
// SHOW CLICK TO REPLAY
function showReplay() {
    replayMessage.style.display = "block";
}
function hideReplay() {
    replayMessage.style.display = "none";
}

// SHOW PLEASE US LANDSCAPE
function showLandscape() {
    landscapeMessage.style.display = "block";
}
function hideLandscape() {
    landscapeMessage.style.display = "none";
}

// Show form name
function showFormBoard() {
    formBoard.style.display = "block";
}
function hideFormBoard() {
    formBoard.style.display = "none";
}

// Show Score Board
function showScoreBoard() {
    scoreBoard.style.display = "block";
}
function hideScoreBoard() {
    scoreBoard.style.display = "none";
}

function submitScore(event) {
    event.preventDefault();
    var name = document.getElementById("playerName").value;
    var score = Math.floor(game.coinCollected * 5) + Math.floor(game.distance / 15);
    var stat = false;
    stat = addData(name, score);
    if (stat) {
        game.status = "scoringDone";
    }
    // console.log(stat);
    return false;
}

// 3D Models
export var planet;
export var sky;
export var coinsHolder;
export var enemiesHolder;
export var particlesHolder;
export var airplane;

export var audioHit;
export var audioCollide;
<<<<<<< HEAD
export var audioWarp;
var audioEngine;
=======
var audioEngine, audioPlaying;
>>>>>>> 33346fbc158af49d3f78901d96537081afd9a781

function createAudio() {
    audioHit = new AudioJam("/audio/explosion.mp3");
    audioEngine = new AudioJam("/audio/engine2.mp3");
    audioCollide = new AudioJam("/audio/explosion.mp3");
<<<<<<< HEAD
    audioWarp = new AudioJam("/audio/warp.mp3");
=======
    audioPlaying = new AudioJam("/audio/sw_intothetrap.mp3");
>>>>>>> 33346fbc158af49d3f78901d96537081afd9a781
}

function createPlane() {
    airplane = new Falcon();

    airplane.mesh.rotation.y = Math.PI / 2;
    airplane.mesh.scale.set(.075, .075, .075);
    airplane.mesh.position.y = game.planeDefaultHeight;
    scene.add(airplane.mesh);
    return 0;
}

function createPlanet() {
    planet = new Planet();
    planet.mesh.position.y = -game.planetRadius - 100;
    scene.add(planet.mesh);
}

function createSky() {
    sky = new Sky();
    sky.mesh.position.y = -game.planetRadius;
    scene.add(sky.mesh);
}

function createCoins() {
    coinsHolder = new CoinsHolder(100);
    scene.add(coinsHolder.mesh)
}

function createEnemies() {
    for (var i = 0; i < 10; i++) {
        var enemy = new Enemy();
        enemiesPool.push(enemy);
    }
    enemiesHolder = new EnemiesHolder();
    //enemiesHolder.mesh.position.y = -game.planetRadius;
    scene.add(enemiesHolder.mesh)
}

function createParticles() {
    for (var i = 0; i < 10; i++) {
        var particle = new Particle();
        particlesPool.push(particle);
    }
    particlesHolder = new ParticlesHolder();
    //enemiesHolder.mesh.position.y = -game.planetRadius;
    scene.add(particlesHolder.mesh)
}


function updatePlane() {
    game.planeSpeed = normalize(mousePos.x, -.5, .5, game.planeMinSpeed, game.planeMaxSpeed);
    var targetY = normalize(mousePos.y, -1, 1, game.planeDefaultHeight - game.planeAmpHeight, game.planeDefaultHeight + game.planeAmpHeight);
    var targetX = normalize(mousePos.x, -1, 1, -game.planeAmpWidth * .7, -game.planeAmpWidth);
    var targetZ = normalize(mousePos.x, -1, 1, game.planeDefaultWidth - game.planeAmpWidth, game.planeDefaultWidth + game.planeAmpWidth);

    game.planeCollisionDisplacementX += game.planeCollisionSpeedX;
    targetX += game.planeCollisionDisplacementX;

    game.planeCollisionDisplacementY += game.planeCollisionSpeedY;
    targetY += game.planeCollisionDisplacementY;

    airplane.mesh.position.y += (targetY - airplane.mesh.position.y) * deltaTime * game.planeMoveSensivity;
    airplane.mesh.position.z += (targetZ - airplane.mesh.position.z) * deltaTime * game.planeMoveSensivity;

    airplane.mesh.rotation.z = (targetY - airplane.mesh.position.y) * deltaTime * game.planeRotXSensivity;
    airplane.mesh.rotation.x = (airplane.mesh.position.y - targetY) * deltaTime * game.planeRotZSensivity;
    var targetCameraZ = normalize(game.planeSpeed, game.planeMinSpeed, game.planeMaxSpeed, game.cameraNearPos, game.cameraFarPos);
    // camera.fov = normalize(mousePos.x,-1,1,40, 80);
    camera.updateProjectionMatrix()
    camera.position.y += (airplane.mesh.position.y - camera.position.y) * deltaTime * game.cameraSensivity;

    game.planeCollisionSpeedX += (0 - game.planeCollisionSpeedX) * deltaTime * 0.03;
    game.planeCollisionDisplacementX += (0 - game.planeCollisionDisplacementX) * deltaTime * 0.01;
    game.planeCollisionSpeedY += (0 - game.planeCollisionSpeedY) * deltaTime * 0.03;
    game.planeCollisionDisplacementY += (0 - game.planeCollisionDisplacementY) * deltaTime * 0.01;
}

function loop() {
    newTime = new Date().getTime();
    deltaTime = newTime - oldTime;
    oldTime = newTime;

    // please use landscape
    if (window.innerHeight > window.innerWidth) {
        showLandscape();
    } else {
        hideLandscape();
    }

    if (game.status == "playing") {
        // Add energy coins every 100m;
        if (game.distance == 0) audioEngine.play(true);
        audioPlaying.play(true);

        if (Math.floor(game.distance) % game.distanceForCoinsSpawn == 0 && Math.floor(game.distance) > game.coinLastSpawn) {
            game.coinLastSpawn = Math.floor(game.distance);
            coinsHolder.spawnCoins();
        }

        if (Math.floor(game.distance) % game.distanceForSpeedUpdate == 0 && Math.floor(game.distance) > game.speedLastUpdate) {
            game.speed = Math.min(game.speed + game.incrementSpeedByTime, game.maxSpeed);
            console.log(game.speed)
        }

        if (Math.floor(game.distance) % game.distanceForEnemiesSpawn == 0 && Math.floor(game.distance) > game.enemyLastSpawn) {
            game.enemyLastSpawn = Math.floor(game.distance);
            enemiesHolder.spawnEnemies();
        }

        if(Math.floor(game.distance) % 213 < 2 && game.distance > 100) {
            console.log("should tr");
            planet.transition();
        }

        updatePlane();
        updateDistance();
        updateDebris();
        updateEnergy();
        updateHealth();

        hideFormBoard();
    } else if (game.status == "gameover") {
        audioEngine.pause();
        audioPlaying.pause();

        game.speed *= .99;
        airplane.mesh.rotation.z += (-Math.PI / 2 - airplane.mesh.rotation.z) * .0002 * deltaTime;
        airplane.mesh.rotation.x += 0.0003 * deltaTime;
        game.planeFallSpeed *= 1.05;
        airplane.mesh.position.y -= game.planeFallSpeed * deltaTime;
        if (airplane.mesh.position.y < -200) {
            showFormBoard();
            game.status = "scoring";

        }
    } else if (game.status == "scoring") {

    } else if (game.status == "scoringDone") {
        game.status = "waitingReplay";
        hideFormBoard();
        showScoreBoard();
        showReplay();
    } else if (game.status == "waitingReplay") {
        hideFormBoard();
        displayTopSeven();
    }

    // airplane.propeller.rotation.x +=.2 + game.planeSpeed * deltaTime*.005;
    ambientLight.intensity += (.5 - ambientLight.intensity) * deltaTime * 0.005;

    coinsHolder.rotateCoins(deltaTime);
    enemiesHolder.rotateEnemies(deltaTime);

    sky.moveClouds(deltaTime);
    planet.rotate(deltaTime);

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}

// MAIN 
var fieldDistance, fieldDebris, energyBar, healthBar, replayMessage, landscapeMessage, formBoard, scoreBoard, leap;
function init(event) {
    // UI
    fieldDistance = document.getElementById("distValue");
    fieldDebris = document.getElementById("debValue");
    energyBar = document.getElementById("energyBar");
    healthBar = document.getElementById("healthBar");
    replayMessage = document.getElementById("replayMessage");
    landscapeMessage = document.getElementById("landscapeMessage");
    formBoard = document.getElementById("formBoard")
    scoreBoard = document.getElementById("scoreBoard");

    // Prepare the game
    resetGame();
    createScene();
    createLights();
    createPlane();
    createPlanet();
    createSky();
    createCoins();
    createEnemies();
    createParticles();
    createAudio();

    // prepare leap
    leap = new Leap.Controller();
    leap.connect();

    // Controll the game
    document.addEventListener('mousemove', handleMouseMove, false);
    document.addEventListener('touchmove', handleTouchMove, false);
    document.addEventListener('mouseup', handleMouseUp, false);
    document.addEventListener('touchend', handleTouchEnd, false);
    leap.on('frame', handleHandMove);
    leap.on('frame', handleHandGrab);

    formBoard.addEventListener('submit', submitScore)

    // Run the game
    loop();
}

window.addEventListener('load', init, false);
//COLORS
var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    brownDark:0x23190f,
    pink:0xF5986E,
    yellow:0xf4ce93,
    blue:0x68c3c0,
    bg: 0x3d3d3d,
    jetblack: 0x444548,

};

var game = resetGame();

function resetGame() {
    game = {
        speed: .0005,
        incrementSpeedByTime: .000025,
        maxSpeed: .002,
        distanceForSpeedUpdate: 100,
        speedLastUpdate: 0,

        distance: 0,
        ratioSpeedDistance: 50,
        energy: 100,
        health: 100,
        ratioSpeedEnergy: 3,

        level: 1,
        levelLastUpdate: 0,
        distanceForLevelUpdate: 1000,

        planeDefaultHeight: 100,
        planeDefaultWidth: 0,
        planeAmpHeight: 80,
        planeAmpWidth: 300,
        planeMoveSensivity: 0.005,
        planeRotXSensivity: 0.0008,
        planeRotZSensivity: 0.0004,
        planeFallSpeed: .01,
        planeMinSpeed: 1.2,
        planeMaxSpeed: 1.6,
        planeSpeed: 0,
        planeCollisionDisplacementX: 0,
        planeCollisionSpeedX: 0,

        planeCollisionDisplacementY: 0,
        planeCollisionSpeedY: 0,

        planetRadius: 1200,
        planetLength: 800,
        planetHeight: 200,
        //planetRotationSpeed:0.006,
        wavesMinAmp: 5,
        wavesMaxAmp: 20,
        wavesMinSpeed: 0.001,
        wavesMaxSpeed: 0.003,

        cameraFarPos: 500,
        cameraNearPos: 150,
        cameraSensivity: 0.002,

        coinDistanceTolerance: 20,
        coinValue: 20,
        coinsSpeed: .5,
        coinLastSpawn: 0,
        distanceForCoinsSpawn: 20,
        coinCollected: 0,

        enemyDistanceTolerance: 20,
        enemyValue: 10,
        enemiesSpeed: .6,
        enemyLastSpawn: 0,
        distanceForEnemiesSpawn: 40,

        status: "playing",
    };
}


export {Colors, game, resetGame};
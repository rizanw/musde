import * as THREE from 'three';
import { camera, scene } from '../index';
import sleep from './sleep';

export class AudioJam {
    constructor(fname){
        this.listener = new THREE.AudioListener();

        camera.add(this.listener);
        this.fname = fname;
        this.sound = new THREE.Audio(this.listener);
        scene.add(this.sound);
    }

    play(loop=false){
        if(this.sound.isPlaying){
            this.sound.stop();
            this.sound.play();
            return 0;
        }

        var audioLoader = new THREE.AudioLoader();

        audioLoader.load(this.fname, (buffer) => {
            this.sound.setBuffer(buffer);
            this.sound.setLoop(loop);
            this.sound.play();
        });
    }

    async pause(){
        for(let i=1; i<=20; i++){
            await sleep(200);
            this.sound.setVolume(1-i*0.05);
        }
        this.sound.pause();
        this.sound.setVolume(1);
    }
}
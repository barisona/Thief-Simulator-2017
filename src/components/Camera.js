import {globals} from '../globals'
import * as THREE from "../../build/three.module.js"
import Detector from './Detector';

class SweepingCamera {
    constructor(roomNum, position, direction, hmin, hmax, vmin, vmax, radius,  speed) {
        this.roomNum = roomNum;
        this.position = position;
        this.direction = direction;
        this.radius = radius;
        this.speed = speed;
        this.detectors = new Array(4);
        this.clock = new THREE.Clock();
        this.theta = 0;
        this.hmin = hmin;
        this.hmax = hmax;
        this.vmin = vmin;
        this.vmax = vmax;

        for (let i = 0; i < this.detectors.length; i++) {
            this.detectors[i] = new Detector(this.position.clone(), this.direction.clone(), 100, 30 );
        }

        const geometry = new THREE.SphereGeometry( 0.25, 32, 16 );
        const material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
        const sphere = new THREE.Mesh( geometry, material );
        
        sphere.position.set(position.x, position.y, position.z);
        globals.SCENE.add( sphere );
    }

    update() {
        let delta = this.clock.getDelta();
        this.theta += delta * this.speed;

        for (let i = 0; i < this.detectors.length; i++) {
            let dir = this.direction.clone();
            dir.x = Math.cos(this.theta + i * Math.PI / 2) * this.radius + this.hmin + (this.hmax - this.hmin) * Math.sin(this.theta);
            dir.z = Math.sin(this.theta + i * Math.PI / 2) * this.radius + this.vmin + (this.vmax - this.vmin) * Math.cos(this.theta);
            this.detectors[i].update(this.position, dir);
        }
    }
}

export default SweepingCamera;
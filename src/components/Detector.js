import {globals} from '../globals'
import * as THREE from "../../build/three.module.js"

class Detector {
    constructor (position, direction, len, theta) {
        
        this.position = position;
        this.direction = direction.normalize();
        this.len = len;
        this.theta = theta;
        this.playerDetected = false;
        this.frontRaycaster = new THREE.Raycaster();

        this.frontRaycaster.set(this.position, this.direction, 0, this.len);


        // creating mesh
        const material = new THREE.LineBasicMaterial({
            color: 0xFF0000
        });

        this.material = material;

        let scene = globals.SCENE;
        const points = [];
        points.push( this.position.clone() );
        points.push( this.position.clone().add(this.direction.clone().multiplyScalar(this.len).normalize()) );

        const geometry = new THREE.BufferGeometry().setFromPoints( points );

        const line = new THREE.LineSegments( geometry, material );
        this.line = line;
        scene.add( line );
    }

    update(newPos, newDir) {
        this.position = newPos;
        this.direction = newDir.normalize();
        // console.log(globals.PLAYER);
        
        this.frontRaycaster.set(this.position, this.direction);
        // console.log(globals.PLAYER.raycast(this.frontRaycaster));
        // console.log(this.frontRaycaster.intersectObjects( globals.SCENE.children));
        // console.log(getClosestIntersection(this.frontRaycaster));
        
        // console.log(this.frontRaycaster.intersectObject(globals.PLAYER));
        // update rendering
        let closest = getClosestIntersection(this.frontRaycaster);
        let lineLen = this.len;
        if (closest) lineLen = Math.min(lineLen, closest.distance);
        // console.log(lineLen);
        let scene = globals.SCENE;
        const points = [];
        points.push( this.position.clone() );
        points.push( this.position.clone().add(this.direction.clone().multiplyScalar(lineLen)) );
     
        const geometry = new THREE.BufferGeometry().setFromPoints( points );

        const line = new THREE.LineSegments( geometry, this.material );
        line.noIntersect = 1;
        
        scene.remove(this.line);

        this.line = line;
        // console.log(newPos.x);
        // console.log(this.line);
        
        scene.add( line );

        let detected = this.frontRaycaster.intersectObject(globals.PLAYER);
        // console.log(this.frontRaycaster.far);

        let lightOpen = false;
        
        for(let key of Object.keys(globals.LIGHTS_ON)){
            let light = globals.ROOM_LIGHTS[key];
            let info = globals.LIGHTS_ON[key];

            if(light.visible && info[0] == globals.CUR_ROOM) lightOpen = true;
        }
        console.log(lightOpen);
        if (detected.length != 0 && (globals.SCENE.getObjectByName("Flashlight").visible || lightOpen)) {
            if (detected[0].distance <= lineLen) {
                globals.GAMEOVER = true;
                console.log(globals.MAIN_CAMERA.position);
            }
            
        }
        
    }

    static detectPlayer() {
        const raycaster = new THREE.Raycaster();
        raycaster.set(globals.MAIN_CAMERA.position, new THREE.Vector3(0, -1, 0));
        let closest = getClosestIntersection(raycaster);
        if (closest == this.target) {
            this.playerDetected = true;
        }

        return true;
    }
}

function getClosestIntersection(raycaster) {
    const intersects = raycaster.intersectObjects( globals.SCENE.children );
    let farthest = null;
    let first = true;
    if(intersects.length > 0){
        for ( let i = 0; i < intersects.length; i++) {
            let intersect = intersects[i];
            // console.log(intersect);
            if (intersect.object.noIntersect != 1) {
                // console.log(intersect);
                if(first || farthest.distance > intersect.distance ){
                    farthest = intersect;
                    first = false;
                }
            }
            
        }
    }
    // console.log(farthest);
    return farthest;
}

export function playerDetected(position, direction, len) {
    const raycaster = new THREE.Raycaster();
    raycaster.set(globals.MAIN_CAMERA.position, new THREE.Vector3(0, -1, 0));
    let farthest = getClosestIntersection(raycaster);
    // console.log(farthest);
}


export default Detector;
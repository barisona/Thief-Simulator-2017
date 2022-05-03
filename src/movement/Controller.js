import { Vector2, Vector3, Raycaster, PerspectiveCamera } from 'three';
import * as THREE from "../../build/three.module.js"
import {globals} from '../globals'
import { showPauseMenu, hidePauseMenu, showItemList, hideItemList } from '../util';

class Controller {
    constructor(controls, scene, document, camera) {
        this.forward = false;
        this.backwards = false;
        this.left = false;
        this.right = false;
        this.controls = controls;
        this.scene = scene;
        this.document = document;
        this.sprint = false;
        this.flashlight = false;
        this.camera = camera;
        this.floatCount = 1000;
        this.clock = new THREE.Clock();
        this.force = 2;
        this.dir = globals.DIRECTION;

        const onKeyDown = event => {
            switch (event.code) {
                case 'Space':
                    if (this.floatCount >= 30) {
                        this.floatCount = 0;
                        this.floatHeight = 0.6;
                    }
                    if (this.force <= -1.9) {
                        this.force = 2;
                    }
                    
                    break;
                case 'ShiftLeft':
                    this.sprint = true;
                    break;
                case 'KeyW':
                    this.forward = true;
                    break;

                case 'KeyA':
                    this.left = true;
                    break;

                case 'KeyS':
                    this.backward = true;
                    break;
                case 'KeyD':
                    this.right = true;
                    break;
                case "KeyF":
                    if(!globals.GAMEOVER && !globals.GAMEWIN){
                        let flashlight = scene.getObjectByName("Flashlight");
                        if(flashlight)
                            flashlight.visible = !flashlight.visible;

                        let ghostLight = globals.GHOSTSCENE.getObjectByName("ghostLight");
                        if(ghostLight)
                            ghostLight.visible = !ghostLight.visible;
                    }
                    break;
                case "KeyL":
                    let position = scene.getObjectByName("Crosshair").position;
                    const light = new THREE.PointLight( 0xffffff, 1, 100 );
                    light.name = "roomLight";
                    light.position.copy(position);
                    const ghostlight = light.clone();
                    scene.add( light );
                    globals.GHOSTSCENE.add(ghostlight);
                    break;
                case "KeyE":
                    showItemList();
            }
        };

        const onKeyUp = event => {
            switch (event.code) {
                case 'ShiftLeft':
                    this.sprint = false;
                    break;
                case 'KeyW':
                    this.forward = false;
                    break;

                case 'KeyA':
                    this.left = false;
                    break;

                case 'KeyS':
                    this.backward = false;
                    break;

                case 'KeyD':
                    this.right = false;
                    break;
                case "KeyE":
                    hideItemList();
            }
        };

        const mouseClick = event => {
            if(!globals.GAMEOVER && !globals.GAMEWIN){
                let crosshair = scene.getObjectByName("Crosshair");
                let crosshairBox = new THREE.Box3();
                crosshairBox.copy( crosshair.geometry.boundingBox ).applyMatrix4( crosshair.matrixWorld );
                
                if(globals.CLICKABLE){
                    let clickable = globals.CLICKABLE;
                    if(clickable.includes("Light_Switch_")){
                        let lightParts = clickable.split("_");
                        let lightName = "roomLight_" + lightParts[2];

                        globals.LIGHTS_ON[lightName][1] = !globals.LIGHTS_ON[lightName][1];

                        let roomLight = scene.getObjectByName(lightName);
                        if(roomLight){
                            console.log(roomLight);
                            roomLight.visible = !(roomLight.visible);
                        }
                        
                        let ghostRoomlight = globals.GHOSTSCENE.getObjectByName(lightName);
                        if(ghostRoomlight){
                            ghostRoomlight.visible = !(ghostRoomlight.visible);
                        }
                    }
                    else if(clickable.includes("Door_")){
                        if(clickable == "Door_0_1") {
                            if (globals.ITEMS.length == 0) {
                                globals.GAMEWIN = true;
                            }
                        }
                            
                        else{
                            let door = globals.DOORS[clickable];
                            door.useDoor();

                            for(let key of Object.keys(globals.ROOM_LIGHTS)){
                                let info = globals.LIGHTS_ON[key];
                                if(info[1] && info[0] == globals.CUR_ROOM){
                                    globals.ROOM_LIGHTS[key].visible = true;
                                    globals.GHOST_LIGHTS[key].visible = true;
                                }
                                else{
                                    globals.ROOM_LIGHTS[key].visible = false;
                                    globals.GHOST_LIGHTS[key].visible = false;
                                }
                            }
                        }
                    }
                    else{
                        let obj = scene.getObjectByName(clickable);
                        scene.remove(obj);

                        const index = globals.ITEMS.indexOf(clickable);
                        if (index > -1) {
                            globals.ITEMS.splice(index, 1);
                        }
                        // console.log(globals.ITEMS);

                        let innerstart = '<link rel="preconnect" href="https://fonts.gstatic.com"><link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@1,100;1,300&family=Poppins&display=swap" rel="stylesheet"><style>#items-container {position: fixed;background-color: rgba(0,0,0,0.5);bottom: 0;right: 0;left: 0;top: 0;opacity: 1;transition: 1s;}#items {padding-top: 5%;width: 50%;color: #ffffff;text-align: center;font-family: Poppins, sans-serif;font-size: 14px;line-height: 40px;cursor: pointer;text-align: center;margin-left: auto;margin-right: auto;}</style><div id="items"><br /><br /><br /><br /><span style="font-size:2em; font-weight: 300; font-family: Montserrat, sans-serif; font-style: italic;">Items to steal:</span><br /><br />';
                        let innerend = '<br/></div>';
                        let innermid = '';
                        for (let item of globals.ITEMS) {
                            innermid += item + '<br/>';
                        }
                        globals.ITEMSLISTHTML.innerHTML = innerstart + innermid + innerend;
                    }
                }
                console.log(globals.LIGHTS_ON);
                console.log(globals.ROOM_LIGHTS);
            }
        }

        
        this.document.addEventListener('keydown', onKeyDown);
        this.document.addEventListener('keyup', onKeyUp);
        this.document.addEventListener('mousedown', mouseClick);
    }

    update() {
        let delta = this.clock.getDelta();
        let thief = this.controls.getObject();
        let howFast = delta * 5;
        if (this.sprint) howFast *= 1.8;

        if (this.forward && this.backward) {
            this.dir.x = 0;
        }
        else if (this.forward) {
            this.dir.x = 1;
        }
        else if (this.backward) {
            this.dir.x = -1;
        }
        else {
            this.dir.x = 0;
        }

        if (this.left && this.right) {
            this.dir.setZ = 0;
        }
        else if (this.right) {
            this.dir.z = 1;
        }
        else if (this.left) {
            this.dir.z = -1;
        }
        else {
            this.dir.z = 0;
        }

        let raycastPos = globals.MAIN_CAMERA.position.clone();
        let pW = 2.5;
        let height = 7;

        let moveF = 0;
        let moveR = 0;
        const frontRaycaster = new THREE.Raycaster();
        let realDir = new THREE.Vector3();
        globals.MAIN_CAMERA.getWorldDirection(realDir);
        realDir.y = 0;

        if (this.forward) {
            let dir = realDir.clone();
            frontRaycaster.set(raycastPos.clone(), dir);
            let farthest = getClosestIntersection(frontRaycaster);
            let move = true;
            if (farthest != undefined ) {
                let dist = farthest.point.distanceTo(raycastPos);
                if (dist < pW) {
                    move = false;
                }
            }

            if (move) moveF += 1;
        }
        
        if (this.backward) {
            let dir = realDir.clone();
            dir.x = -dir.x;
            dir.z = -dir.z;
            frontRaycaster.set(raycastPos.clone(), dir);
            let farthest = getClosestIntersection(frontRaycaster);
            let move = true;
            if (farthest != undefined ) {
                let dist = farthest.point.distanceTo(raycastPos);
                if (dist < pW) {
                    move = false;
                }
            }

            if (move) moveF -= 1;
        }
        if (this.right) {
            let dir = realDir.clone();
            dir.x = -dir.z;
            dir.z = dir.x;
            frontRaycaster.set(raycastPos.clone(), dir);
            let farthest = getClosestIntersection(frontRaycaster);
            let move = true;
            if (farthest != undefined ) {
                let dist = farthest.point.distanceTo(raycastPos);
                if (dist < pW) {
                    move = false;
                }
            }

            if (move) moveR += 1;
        }
        if (this.left) {
            let dir = realDir.clone();
            dir.x = dir.z;
            dir.z = -dir.x;
            frontRaycaster.set(raycastPos.clone(), dir);
            let farthest = getClosestIntersection(frontRaycaster);
            let move = true;
            if (farthest != undefined ) {
                let dist = farthest.point.distanceTo(raycastPos);
                if (dist < pW) {
                    move = false;
                }
            }

            if (move) moveR -= 1;
        }

        this.controls.moveForward(howFast * moveF);
        this.controls.moveRight(howFast * moveR);


        if (this.force >= -2) {
            this.force -= delta * 5;
        }
        if (this.force < -2) {
            this.force = -2;
        }


        if (globals.LOADED[1]) {
            this.camera.position.y += delta * this.force * 10;
        }
        if (this.camera.position.y < height) {
            this.camera.position.y = height;
        }
        if (this.camera.position.y > 10) {
            this.camera.position.y = 10;
        }
        
        

            

        // if (globals.LOADED[0]) {
        //     this.camera.position.y += delta * this.force * 10;
        // }
        // if (this.camera.position.y < height) {
        //     this.camera.position.y = height;
        // }
        
        
        const raycaster = new Raycaster();
        raycaster.set(this.camera.position, new Vector3(0, -1, 0));
        const intersects = raycaster.intersectObjects( this.scene.children );
        // console.log(intersects);
        
    }
}

function checkBoxIntersection(disp) {
    let playerBox = new THREE.Box3();
    globals.PLAYER.geometry.computeBoundingBox();
    playerBox.copy(globals.PLAYER.geometry.boundingBox ).applyMatrix4(globals.PLAYER.matrixWorld);
    playerBox.min.add(disp);
    playerBox.max.add(disp);
    console.log(playerBox);
    let collision = false;
    globals.SCENE.traverse((child) => {
            let childBox = new THREE.Box3();
            if(child.geometry && child.geometry.boundingBox){
                childBox.copy(child.geometry.boundingBox).applyMatrix4( child.matrixWorld );
                if(childBox.intersectsBox(playerBox) && child.name != "Crosshair" && child.name != "Flashlightbbox"){
                    console.log("COLLISION");
                    //console.log(child);
                    let dir = globals.DIRECTION;
                    //console.log(globals.MAIN_CAMERA.getWorldDirection());
                    console.log(childBox);
                    console.log(globals.MAIN_CAMERA.position);
                    if (prevPos) {
                        globals.MAIN_CAMERA.position.x = prevPos.x;
                        globals.MAIN_CAMERA.position.z = prevPos.z;
                    }

                    
                    collision = true;
                    console.log("COLLIIIIIISIOINONNN");
                }
            }
        })
}

function getClosestIntersection(raycaster) {
    const intersects = raycaster.intersectObjects( globals.SCENE.children );
    let farthest = null;
    let first = true;
    if(intersects.length > 0){
        for ( let i = 0; i < intersects.length; i++) {
            let intersect = intersects[i];
            // console.log(intersect);
            if (intersect.object.noIntersect != 1 && intersect.object.name != "Flashlightbbox") {
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

export default Controller;
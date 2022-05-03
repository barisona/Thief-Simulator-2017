import {globals} from './globals'
import * as THREE from "../build/three.module.js"

const pW = 2.5;
const height = 7;
let prevPos = globals.PREV_POS;
let prevNoCol = false;

// function getClosestIntersection(raycaster) {
//     const intersects = raycaster.intersectObjects( globals.SCENE.children );
//     let farthest = intersects[0];
//     if(intersects.length > 0){
//         for ( let i = 1; i < intersects.length; i++) {
//             let intersect = intersects[i];
//             if(farthest.distance > intersect.distance){
//                 farthest = intersect;
//             }
//         }
//     }
//     return farthest;
// }

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

export function handleBoundaries() {
    const bottomRaycaster = new THREE.Raycaster();
    const raycastPos = globals.MAIN_CAMERA.position.clone();
    bottomRaycaster.set(globals.MAIN_CAMERA.position, new THREE.Vector3(0, -1, 0));
    let farthest = getClosestIntersection(bottomRaycaster);
    if (farthest != undefined && globals.MAIN_CAMERA.position.y - height < farthest.point.y && farthest.object.name != "Flashlightbbox") {
        globals.MAIN_CAMERA.position.y = farthest.point.y + height;
        console.log("fixing");
    }

    let x = 0;
    let z = 0;
    for (let i = -1; i <= 1; i++) {
        shootRays(raycastPos.clone().sub(new THREE.Vector3(0, i, 0)))
    }
    // let playerBox = new THREE.Box3();
    // globals.PLAYER.geometry.computeBoundingBox();

    // playerBox.copy(globals.PLAYER.geometry.boundingBox ).applyMatrix4(globals.PLAYER.matrixWorld);
    // let collision = false;
    // globals.SCENE.traverse((child) => {
    //         let childBox = new THREE.Box3();
    //         if(child.geometry && child.geometry.boundingBox){
    //             childBox.copy(child.geometry.boundingBox).applyMatrix4( child.matrixWorld );
    //             if(childBox.intersectsBox(playerBox) && child.name != "Crosshair" && child.name != "Flashlightbbox"){
    //                 console.log("COLLISION");
    //                 //console.log(child);
    //                 let dir = globals.DIRECTION;
    //                 //console.log(globals.MAIN_CAMERA.getWorldDirection());
    //                 console.log(childBox);
    //                 console.log(globals.MAIN_CAMERA.position);
    //                 if (prevPos) {
    //                     globals.MAIN_CAMERA.position.x = prevPos.x;
    //                     globals.MAIN_CAMERA.position.z = prevPos.z;
    //                 }

                    
    //                 collision = true;
    //             }
    //         }
    //     })

    // if (!collision) {
    //     prevPos = globals.MAIN_CAMERA.position.clone();
    //     prevNoCol = true;
    // }
    
    // front boundary



    
}


function shootRays(raycastPos) {
    let x = 0;
    let z = 0;

    const frontRaycaster = new THREE.Raycaster();
    frontRaycaster.set(raycastPos.clone(), new THREE.Vector3(-1, 0, 0));
    let farthest = getClosestIntersection(frontRaycaster);
    if (farthest != undefined && globals.MAIN_CAMERA.position.x - pW < farthest.point.x && farthest.object.name != "Flashlightbbox" && farthest.object.name != "Lanterna_Cylinder") {
        globals.MAIN_CAMERA.position.x = farthest.point.x + pW;
        console.log(farthest.object.name);
    }

    const backRaycaster = new THREE.Raycaster();
    backRaycaster.set(raycastPos.clone(), new THREE.Vector3(1, 0, 0));
    farthest = getClosestIntersection(backRaycaster);
    if (farthest != undefined && globals.MAIN_CAMERA.position.x + pW > farthest.point.x  && farthest.object.name != "Flashlightbbox" && farthest.object.name != "Lanterna_Cylinder") {
        globals.MAIN_CAMERA.position.x = farthest.point.x - pW;
        x = -1;
        console.log(farthest.object.name);
    }


    const leftRaycaster = new THREE.Raycaster();
    leftRaycaster.set(raycastPos.clone(), new THREE.Vector3(0, 0, -1));
    farthest = getClosestIntersection(leftRaycaster);
    if (farthest != undefined && globals.MAIN_CAMERA.position.z - pW < farthest.point.z  && farthest.object.name != "Flashlightbbox" && farthest.object.name != "Lanterna_Cylinder") {
        globals.MAIN_CAMERA.position.z = farthest.point.z + pW;
        z = 1;
        console.log(farthest.object.name);
    }

    const rightRaycaster = new THREE.Raycaster();
    rightRaycaster.set(raycastPos.clone(), new THREE.Vector3(0, 0, 1));
    farthest = getClosestIntersection(rightRaycaster);
    if (farthest != undefined && globals.MAIN_CAMERA.position.z + pW > farthest.point.z  && farthest.object.name != "Flashlightbbox" && farthest.object.name != "Lanterna_Cylinder") {
        globals.MAIN_CAMERA.position.z = farthest.point.z - pW;
        z = -1;
        console.log(farthest.object.name);
    }

    return [x, z];
}
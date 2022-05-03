import {globals} from './globals'
import * as THREE from "../build/three.module.js"
import Guard from './components/Guard.js';
// Set Flashlight's Position
export function updateFlashlight(){
    let mesh = globals.MODELS["Flashlight"].mesh;
    if(mesh){
        mesh.scale.set(0.15, 0.15, 0.15);
        let forward = new THREE.Vector3()
        globals.MAIN_CAMERA.getWorldDirection(forward);

        // https://discourse.threejs.org/t/getworlddirection-get-vectors-directed-at-90-degrees/19852
        const up = new THREE.Vector3();
        // up.copy(camera.up).applyMatrix4( camera.matrixWorld ).normalize();
        up.copy(globals.MAIN_CAMERA.up).normalize();

        const right = new THREE.Vector3();
        right.crossVectors( forward, up ).normalize();

        let flashlightpos = new THREE.Vector3()
        // flashlightpos = camera.position.clone().add(forward).sub(up.clone().multiplyScalar(2)).add(right);
        flashlightpos = globals.MAIN_CAMERA.position.clone().add(forward).add(right).sub(up.clone().multiplyScalar(0.5));

        mesh.position.set(
            // camera.position.x + forward.x * 2 + right.x, // - Math.sin(camera.rotation.y + Math.PI/6)*3,
            // camera.position.y - forward.y - 1, // - 1.5 + Math.sin(time*4 + camera.position.x + camera.position.z)*0.1,
            // camera.position.z + forward.z * 2 + right.z // + Math.cos(camera.rotation.y + Math.PI/6)*3 
            flashlightpos.x,
            flashlightpos.y,
            flashlightpos.z
        );
    
        mesh.rotation.set(
            globals.MAIN_CAMERA.rotation.x,
            globals.MAIN_CAMERA.rotation.y - Math.PI,
            globals.MAIN_CAMERA.rotation.z
        );
    }
}

// update guards
export function updateGuards(){
    let delta = globals.CLOCK.getDelta();
    for(let i = 0; i < globals.GUARDS.length; i++){
        let guard = globals.GUARDS[i];
        globals.GHOSTBOXES[i].ghost.position.copy(guard.mesh.position);

        let collided = false;

        /* let guardBbox = guard.mesh.children[1];

        let guardBox = new THREE.Box3().setFromObject(guardBbox); */

        let guardBox = new THREE.Box3().setFromObject(guard.mesh).expandByScalar(2);

        let playerBox = new THREE.Box3();
        globals.PLAYER.geometry.computeBoundingBox();

        playerBox.copy(globals.PLAYER.geometry.boundingBox ).applyMatrix4(globals.PLAYER.matrixWorld);

        if (guardBox.intersectsBox(playerBox)) {
            globals.GAMEOVER = true;
        }

        let dX = guard.direction.x * guard.speed * delta;
        let dZ = guard.direction.z * guard.speed * delta;

        // globals.SCENE.traverse((child) => {
        //     let childBox = new THREE.Box3();
        //     if(child.geometry && child.geometry.boundingBox){
        //         childBox.copy(child.geometry.boundingBox).applyMatrix4( child.matrixWorld );
        //         if(childBox.intersectsBox(guardBox) && child.name != ("bbox" + guard.id)
        //            && child.name != "Crosshair" && child.name != "Player" 
        //            && !guard.mesh.getObjectByName(child.name)){
        //             guard.mesh.position.x -= 2*dX;
        //             guard.mesh.position.z -= 2*dZ;
        //             collided = true;
        //         }  
        //     }
        // })

        collided = shootRays(guard.mesh.position, guard.direction, 2);

        if (collided) {
            guard.mesh.position.x -= 2*dX;
            guard.mesh.position.z -= 2*dZ;
        }

        Guard.update(guard, delta, collided);

        dX = guard.direction.x * guard.speed * delta;
        dZ = guard.direction.z * guard.speed * delta;

        guard.mesh.position.x += dX;
        guard.mesh.position.z += dZ;
    }
}


// COPIED CODE
function shootRays(raycastPos, dir, pW) {
    let collided = false;

    const frontRaycaster = new THREE.Raycaster();
    frontRaycaster.set(raycastPos.clone(), dir.clone());
    let farthest = getClosestIntersection(frontRaycaster);
    if (farthest != undefined && farthest.distance < pW && farthest.object.name != "Flashlightbbox" && farthest.object.name != "Lanterna_Cylinder") {
        collided = true;
    }

    return collided;
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
// END COPIED CODE

export function isClickable(models, crosshair){
    let crosshairBox = new THREE.Box3().setFromObject(crosshair);

    for(let key of Object.keys(models)){
        if(models[key]){
            let meshBox = models[key].bbox;
            
            if(meshBox.intersectsBox(crosshairBox)){
                let cube = globals.CUBE;
                let cameraPos = globals.MAIN_CAMERA.position;
                let cubePos = cube.position;
                let dist = cameraPos.distanceTo(cubePos);

                if(dist < 10) return key;
                else return null;
            }
        }
        
    }
    return null;
}

// update crosshair
export function updateCrossHair(mouseIntersection){
    if(mouseIntersection){
        let cube = globals.CUBE;
        cube.position.copy(mouseIntersection);

        let cameraPos = globals.MAIN_CAMERA.position;
        let cubePos = cube.position;
        let dist = cameraPos.distanceTo(cubePos);

        let scale = dist / 10;
        
        cube.scale.x = scale;
        cube.scale.y = scale;
        cube.scale.z = scale;
    }
}
import {globals} from '../globals'
import * as THREE from "../../build/three.module.js"
import Guard from './Guard.js';
import SweepingCamera from './Camera.js';
import {loadAssets} from './objects/assets.js'

// Loads assets and objects
export function initializeAndLoad(){
    let scene = globals.SCENE;
    let ghostScene = globals.GHOSTSCENE;
    let camera = globals.MAIN_CAMERA;
    let minimapcam = globals.MINIMAP_CAM;

    const geometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1);
    const material = new THREE.MeshBasicMaterial( {color: 0x000000} );
    globals.CUBE = new THREE.Mesh( geometry, material )
    const cube = globals.CUBE;
    cube.geometry.computeBoundingBox();
    cube.name = "Crosshair"
    scene.add( cube );
    cube.visible = false;

    let ghostCube = cube.clone();
    globals.GHOST_CUBE = ghostCube;
    ghostScene.add(ghostCube);

    // document.body.appendChild();
    

    // set up sweepingcameras
    const sweepingCameras = new Array();

    // light camera
    //sweepingCameras.push(new SweepingCamera(new THREE.Vector3(54, 14, 0), new THREE.Vector3(0, -1, 0), -0.25, 0.25, -0.25 , 0.25, 0.1, 1));

    // exit camera
    //sweepingCameras.push(new SweepingCamera(new THREE.Vector3(54, 15, 20), new THREE.Vector3(0, -1, 0), -0.5, 0.5, 0 , 0, 0.1, 1.5));
    //sweepingCameras.push(new SweepingCamera(new THREE.Vector3(54, 15, 25), new THREE.Vector3(0, -1, 0), -0.5, 0.5, 0 , 0, 0.1, 1));
    sweepingCameras.push(new SweepingCamera(1, new THREE.Vector3(54, 14.5, 30), new THREE.Vector3(0, -1, 0), -0.5, 0.5, 0 , 0, 0.1, 1.5));

    // hallway camera
    sweepingCameras.push(new SweepingCamera(1, new THREE.Vector3(13.3, 14.5, -12), new THREE.Vector3(0, -1, 0), 0, 0.5, 1 , 1.5, 0.25, 1));

    // bathroom camera
    sweepingCameras.push(new SweepingCamera(3, new THREE.Vector3(-11.2, 14.3, 41.5), new THREE.Vector3(0, -1, 0), 0, 1, 0, 1, 0.25, 1));

    // normal bedroom camera
    sweepingCameras.push(new SweepingCamera(2, new THREE.Vector3(17.9, 14.6, 42.4), new THREE.Vector3(0, -1, 0), 0, 0, 0, -1.5, 0.4, 1));

    // creepy bedroom camera
    sweepingCameras.push(new SweepingCamera(5, new THREE.Vector3(13.1, 14.3, -43), new THREE.Vector3(0, -1, 0), -0.25, -0.25, 0, 1, 0.25, 1));

    // office camera
    sweepingCameras.push(new SweepingCamera(4, new THREE.Vector3(42.5, 14.3, -43), new THREE.Vector3(0, -1, 0), -0.25, 2, 0, 0, 0.25, 1));


    globals.SWEEPING_CAMERAS = sweepingCameras;


    // Set up camera
    camera.position.set(6, 10, -10);
    camera.lookAt(new THREE.Vector3(5, 2, 1));

    // Set up minimap camera
    minimapcam.position.set(camera.position.x, 100, camera.position.z);
    minimapcam.lookAt(new THREE.Vector3(0, -1, 0));

    const spotLight = new THREE.SpotLight(0xffffff, 1, 0, Math.PI * 0.1, 0.4, 1);
    spotLight.target = cube;
    spotLight.name = "Flashlight";
    spotLight.castShadow = true;
    spotLight.shadow.camera.top = 1;
    spotLight.shadow.camera.bottom = - 1;
    spotLight.shadow.camera.left = - 1;
    spotLight.shadow.camera.right = 1;
    spotLight.shadow.camera.near = 0.1;
    spotLight.shadow.camera.far = 100;
    spotLight.shadow.mapSize.set( 1024, 1024 );

    globals.FLASH_LIGHT = spotLight;

    scene.add(spotLight);

    const playerGeo = new THREE.BoxGeometry(1.5, 4, 1.5);
    const playerMat = new THREE.MeshBasicMaterial( {color: 0x0000FF });
    const player = new THREE.Mesh(playerGeo, playerMat);

    globals.PLAYER = player;
    globals.PLAYER.geometry.computeBoundingBox();

    // const playerBbox = player.clone();
    // playerBbox.name = "Player";
    // playerBbox.geometry.computeBoundingBox();
    // // scene.add(playerBbox);
    // playerBbox.visible = true;
    // playerBbox.geometry.z = 10;

    ghostScene.add( player )

    let ghostSpotlight = spotLight.clone();
    ghostSpotlight.target = ghostCube;
    ghostSpotlight.distance = 0;
    ghostSpotlight.name = "ghostLight";
    ghostScene.add(ghostSpotlight);

    globals.GHOST_FLASH = ghostSpotlight;

    // Setting up guards
    Guard.setGuards();

    loadAssets();
}

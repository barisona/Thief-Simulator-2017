/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { Controller } from './movement';
import { SeedScene } from 'scenes';
import * as THREE from "../build/three.module.js"
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { hideStartmenu, showPauseMenu, hidePauseMenu } from './util';
import { updateFlashlight, updateGuards, updateCrossHair, isClickable} from './updateutil';
import { handleBoundaries } from './playerutil';
import Guard from './components/Guard.js';
import SweepingCamera from './components/Camera.js';
import {globals} from './globals'
import {setAssets, loadAssets} from './components/objects/assets.js'
import { initializeAndLoad } from './components/init';
import {loadHTML, loadingBar, createCrosshair} from './loadHtml.js'
import Stats from 'stats.js'
import {restart} from './restart.js'

const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)


document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
loadingBar();

// Initialize core ThreeJS components
// const scene = new SeedScene();
const manager = new THREE.LoadingManager();
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
};

manager.onLoad = function ( ) {
	// call start menu
    let loading = document.getElementById("loading-container");
    loading.style.display = "none";
    loadHTML(canvas, minimapCanvas);
};
manager.onError = function ( url ) {
	console.log( 'There was an error loading ' + url );
};

globals.LOADING_MANAGER = manager;

const scene = new SeedScene();
globals.SCENE = scene;
const ghostScene = scene.clone();
globals.GHOSTSCENE = ghostScene;
const raycaster = new THREE.Raycaster();
const camera = new PerspectiveCamera(50, 1, 1, 1000);
globals.MAIN_CAMERA = camera;
globals.PREV_POS = camera.position;
const minimapcam = new PerspectiveCamera();
globals.MINIMAP_CAM = minimapcam;
const renderer = new WebGLRenderer({ antialias: true });
const minimapRenderer = new WebGLRenderer({antialias: true});

var pauseTime = -1;
var timeAdd = 0;

// assets and objects
initializeAndLoad();

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
minimapRenderer.setPixelRatio(window.devicePixelRatio);

// load html elements
const canvas = renderer.domElement;
const minimapCanvas = minimapRenderer.domElement;

// Set up controls
const controls = new PointerLockControls(camera, canvas);
const controller = new Controller(controls, scene, document, camera);
// controls.dragToLook = true;
// controls.enableDamping = true;
// controls.enablePan = false;
// controls.minDistance = 4;
// controls.maxDistance = 16;

document.body.addEventListener('mousedown', function () {
    if(globals.GAMEOVER || globals.GAMEWIN){
        restart();
        window.requestAnimationFrame(onAnimationFrameHandler);
    }
    if (globals.PAUSE) {
        controls.lock();
    }
});
controls.addEventListener('lock', () => {
    hideStartmenu();
    hidePauseMenu();
    createCrosshair();
    globals.PAUSE = false;
    globals.PAUSE_END = Math.floor(Date.now()/1000);
    globals.TIME_PAUSE += globals.PAUSE_END - globals.PAUSE_START;
    window.requestAnimationFrame(onAnimationFrameHandler);
})
controls.addEventListener('unlock', function () {
    globals.INNER_CIRCLE.style.display = "none";
    globals.OUTER_CIRCLE.style.display = "none";
    if(!globals.GAMEOVER && !globals.GAMEWIN){
        showPauseMenu();
        globals.PAUSE = true;
        globals.PAUSE_START = Math.floor(Date.now()/1000);
    }
});

const pointer = new THREE.Vector2();

let mouseIntersection;

// const startTime = Math.floor(Date.now()/1000); //countdown start time
const startTime = 0; //countdown start time

camera.position.set(56, 4, 42);
camera.lookAt(56, 4, -12)

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    stats.begin();
    if (globals.SWEEPING_CAMERAS) {
        for (let i = 0; i < globals.SWEEPING_CAMERAS.length; i++) {
            let cam = globals.SWEEPING_CAMERAS[i];
            if(cam.roomNum == globals.CUR_ROOM)
                globals.SWEEPING_CAMERAS[i].update();
        }
    }

    globals.MINIMAP_CAM.position.set(camera.position.x, 50, camera.position.z);
    globals.MINIMAP_CAM.lookAt(camera.position.x, 0, camera.position.z);
    let cube = globals.CUBE;
    let hoverOn = isClickable(globals.CLICKABLE_MESHES, cube);
    globals.CLICKABLE = hoverOn;

    let outerCircle = globals.OUTER_CIRCLE;
    let innerCircle = globals.INNER_CIRCLE;

    if(hoverOn && !globals.GAMEOVER && !globals.GAMEWIN){
        if(hoverOn == "Door_0_1"){
            if (globals.ITEMS.length == 0){
                outerCircle.style.border = "2px solid red";
                innerCircle.style.backgroundColor = "red";
            }
        }
        else{
            outerCircle.style.border = "2px solid green";
            innerCircle.style.backgroundColor = "green";
        }
    }
    else{
        outerCircle.style.border = "2px solid white";
        innerCircle.style.backgroundColor = "white";
    }

    updateGuards();

    if(!globals.LOADED[0]) setAssets();

    globals.FLASH_LIGHT.position.copy(camera.position);
    let offset = camera.position.clone().sub(cube.position).multiplyScalar(0.60);
    globals.GHOST_FLASH.position.copy(camera.position.clone().add(offset));

    if(!globals.GAMEOVER && !globals.GAMEWIN)
        controller.update();

    handleBoundaries();
    scene.update && scene.update(timeStamp);
    updateFlashlight();

    let player = globals.PLAYER;
    player.position.set(camera.position.x, camera.position.y, camera.position.z);
    //playerBbox.position.set(camera.position.x, camera.position.y, camera.position.z);
    player.rotation.set(
            camera.rotation.x,
            camera.rotation.y,
            camera.rotation.z
        );
    
    // update the picking ray with the camera and pointer position

    raycaster.setFromCamera( pointer, camera );
    // calculate objects intersecting the picking ray
    
    const intersects = raycaster.intersectObjects( scene.children );
    if(intersects.length > 0){
        let closest;
        let distance = Number.MAX_VALUE;
        for ( let i = 0; i < intersects.length; i++) {
            let intersect = intersects[i];
            if(intersect.object.name != 'Crosshair' && intersect.object.noIntersect != 1 && distance > intersect.distance){
                closest = intersect;
                distance = intersect.distance;
            }
        }
        if (closest) {
            mouseIntersection = closest.point;
        }
    }

    updateCrossHair(mouseIntersection);
    globals.GHOST_CUBE.position.copy(cube.position);

    renderer.render(scene, camera);
    minimapRenderer.render(ghostScene, minimapcam);

    if(globals.PAUSE && pauseTime == -1){
        pauseTime = Math.floor(Date.now()/1000);
    }
    if(!globals.PAUSE){
        pauseTime = -1;
    }

    var currTime = Math.floor(Date.now()/1000);
    var timeout = countdown(startTime, currTime, pauseTime);

    if(timeout == -1) {
        globals.PAUSE = true
    }

    if(globals.GAMEOVER || globals.GAMEWIN){
        let score = document.createElement('div');
        score.innerHTML = 'Stole ' + (globals.ITEMS_COPY.length - globals.ITEMS.length) + ' out of ' + globals.ITEMS_COPY.length + ' items';
        score.style.fontSize = "25px";
        score.style.marginTop = "35px";

        let restartButton = document.createElement('div');
        restartButton.id = 'restart-button';
        restartButton.innerHTML = 'Click Anywhere to Restart the Game';
        restartButton.style.fontSize = "18px";
        restartButton.style.marginTop = "35px";

        globals.INNER_CIRCLE.style.display = "none";
        globals.OUTER_CIRCLE.style.display = "none";

        if (globals.GAMEOVER) {
            globals.END_OF_GAME.innerHTML = "You Got Caught!";
        }
        if (globals.GAMEWIN) {
            globals.END_OF_GAME.innerHTML = "WINNER WINNER CHICKEN DINNER";
        }

        globals.END_OF_GAME.appendChild(score);
        globals.END_OF_GAME.appendChild(restartButton);

        restartButton.onclick = function () {
            console.log(1);
        };
    }

    if (!globals.PAUSE && !globals.GAMEOVER && !globals.GAMEWIN) {
        window.requestAnimationFrame(onAnimationFrameHandler);
    }
    stats.end();
};


//countdown function
function countdown(startTime, currTime) {
    var timeLeft;
    
    if(globals.PAUSE){
        timeLeft = globals.PAUSE_START - startTime - globals.TIME_PAUSE;
    } else {
        timeLeft = currTime - startTime - globals.TIME_PAUSE;
    }

    timeLeft = 300 - timeLeft;
    if(timeLeft<=0) return -1;

    var m = Math.floor(timeLeft/60);
    var s = timeLeft % 60;

    if(!globals.GAMEOVER && !globals.GAMEWIN){
            if(s<10){
                globals.TIMER.innerHTML =m +":0"+s;
            }
            else{
                globals.TIMER.innerHTML = m +":"+s;
            }
    }

    return timeLeft;
}


// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    minimapRenderer.setSize(innerHeight / 4.2, innerHeight / 4.2);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();

/*     img.style.top = ycenter + 'px';
    img.style.left = xcenter + 'px'; */

    let xcenter = Math.floor(window.innerWidth / 2 - 17);
    let ycenter = Math.floor(window.innerHeight / 2 - 17);
    if(globals.INNER_CIRCLE && globals.OUTER_CIRCLE){
        globals.OUTER_CIRCLE.style.top = ycenter + 'px';
        globals.OUTER_CIRCLE.style.left = xcenter + 'px';
    
        xcenter = Math.floor(window.innerWidth / 2);
        ycenter = Math.floor(window.innerHeight / 2 );
        globals.INNER_CIRCLE.style.top = ycenter + 'px';
        globals.INNER_CIRCLE.style.left = xcenter + 'px';
    }
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);
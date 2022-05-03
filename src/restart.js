import { globals } from "./globals";
import * as THREE from "../build/three.module.js"
import { resetAssets } from "./components/objects/assets.js";
import Guard from "./components/Guard.js";

export function restart(){
    globals.GAMEOVER = false;
    globals.GAMEWIN = false;
    
    globals.PAUSE = true;
    globals.PAUSE_START = 0;
    globals.PAUSE_END = 0;
    globals.TIME_PAUSE = 0;

    globals.FLASH_LIGHT.visible = true; 

    globals.OUTER_CIRCLE.style.display = 'block';
    globals.INNER_CIRCLE.style.display = 'block';
    globals.END_OF_GAME.innerHTML = "";

    let items = [];
    for(let i = 0; i < globals.ITEMS_COPY.length; i++){
        items.push(globals.ITEMS_COPY[i]);
    }

    globals.ITEMS = items;

    let innerstart = '<link rel="preconnect" href="https://fonts.gstatic.com"><link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@1,100;1,300&family=Poppins&display=swap" rel="stylesheet"><style>#items-container {position: fixed;background-color: rgba(0,0,0,0.5);bottom: 0;right: 0;left: 0;top: 0;opacity: 1;transition: 1s;}#items {padding-top: 5%;width: 50%;color: #ffffff;text-align: center;font-family: Poppins, sans-serif;font-size: 14px;line-height: 40px;cursor: pointer;text-align: center;margin-left: auto;margin-right: auto;}</style><div id="items"><br /><br /><br /><br /><span style="font-size:2em; font-weight: 300; font-family: Montserrat, sans-serif; font-style: italic;">Items to steal:</span><br /><br />';
    let innerend = '<br/></div>';
    let innermid = '';
    for (let item of globals.ITEMS) {
        innermid += item + '<br/>';
    }
    globals.ITEMSLISTHTML.innerHTML = innerstart + innermid + innerend;

    let camera = globals.MAIN_CAMERA;
    camera.position.set(56, 4, 42);
    camera.lookAt(56, 4, -12)

    globals.DIRECTION = new THREE.Vector3(0, 0, 0);
    globals.PREV_POS =  new THREE.Vector3(0, 0, 0);

    resetAssets();
    Guard.resetGuards();    
}

import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
//import MODEL from './darkScene.gltf';
import * as THREE from "../../../../build/three.module"
import { globals } from '../../../globals';
import Door from '../../Door';

class Test extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new THREE.ObjectLoader(globals.LOADING_MANAGER);

        this.name = 'test';

        loader.load('./src/components/objects/House/house.json', (house) => {
            house.traverse(obj => {
                if(obj.isMesh){
                    obj.receiveShadow = true;
                }
                
                const lightRegExp = /^Light_([0-9])*$/;
                const lighRE = new RegExp(lightRegExp);

                const doorRegExp = /^Door_([0-9])*_([0-9])*$/;
                const doorRE = new RegExp(doorRegExp);

                if(lighRE.test(obj.name)){
                    const roomLight = new THREE.AmbientLight(0xffffff, 0.40);
                    roomLight.visible = false;
                    roomLight.name = "room" + obj.name;
                    roomLight.position.copy(obj.position);
                    roomLight.position.y -= 2;
                    globals.SCENE.add(roomLight);

                    const ghostRoomlight = roomLight.clone();
                    globals.GHOSTSCENE.add(ghostRoomlight);
                }

                else if(obj.name.includes("Light_Switch_")){
                    let bbox = new THREE.Box3().setFromObject(obj);
            
                    let clickableSwitch = {};
                    clickableSwitch.mesh = null;
                    clickableSwitch.bbox = bbox;

                    globals.CLICKABLE_MESHES[obj.name] = clickableSwitch;
                }

                else if(doorRE.test(obj.name)){
                    let door;
                    if(obj.name == "Door_4_5"){
                        door = new Door(obj, true);
                    }
                    else door = new Door(obj, false);

                    let clickableDoor = {};
                    clickableDoor.mesh = null;
                    clickableDoor.bbox = new THREE.Box3().setFromObject(obj);

                    globals.DOORS[door.name] = door;
                    globals.CLICKABLE_MESHES[door.name] = clickableDoor;
                }
            })
            globals.LOADED[1] = true;
            this.add(house);
        });
    }
}

export default Test;

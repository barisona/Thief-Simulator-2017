import * as THREE from "../../build/three.module"
import { globals } from "../globals";

export class Door{
    constructor(doorMesh, isVertical){

        this.name = doorMesh.name;
        
        const bbox = new THREE.Box3().setFromObject(doorMesh);
        const pos = new THREE.Vector3((bbox.min.x + bbox.max.x) / 2, (bbox.min.y + bbox.max.y) / 2, (bbox.min.z + bbox.max.z) / 2);

        this.pos1 = pos.clone();
        this.pos2 = pos.clone();

        const nameParts = doorMesh.name.split("_");
        this.room1 = nameParts[1];
        this.room2 = nameParts[2];

        let doorDist = 3;
        if(isVertical){
            this.pos1.x += doorDist;
            this.pos2.x -= doorDist;

        } else{
            this.pos1.z += doorDist;
            this.pos2.z -= doorDist;
        }
    }

    useDoor(){
        let newRoom = globals.CUR_ROOM == this.room1 ? this.room2 : this.room1;
        if(globals.CUR_ROOM == this.room1){
            globals.MAIN_CAMERA.position.copy(this.pos2);
            globals.CUR_ROOM = this.room2;
        }
        else{
            globals.MAIN_CAMERA.position.copy(this.pos1);
            globals.CUR_ROOM = this.room1;
        }
    }
}

export default Door;
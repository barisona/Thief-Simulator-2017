import * as THREE from "../../../build/three.module.js"
import {globals} from '../../globals'
import {MTLLoader} from "../../loaders/MTLLoader.js"    
import {OBJLoader} from "../../loaders/OBJLoader.js"

// obj, mtl - name in the directory
// mesh - always null here
// bboxScale - null if obj itself has a bbox, we manually pick to be as close as possible
// bbox - always null here
// pos - position
// size - scale property
// is the object clickable (items to pick and light switches are in this category

let models = {
    'Flashlight': {
        obj: 'Flashlight.obj',
        mtl: 'Flashlight.mtl',
        mesh: null,
        rot: new THREE.Vector3(0, 0, 0),
        angle: Math.PI,
        bboxScale: new THREE.Vector3(4, 3, 15),
        bbox: null,
        pos: null,
        size: new THREE.Vector3(0.5, 0.5, 0.5),
        clickable: false
    },
    'Diamonds': {
        json: 'Diamonds.json',
        mesh: null,
        rot: new THREE.Vector3(0, 0, 0),
        angle: new THREE.Vector3(0, 0, 0),
        bboxScale: new THREE.Vector3(8, 4, 4),
        bbox: null,
        pos: new THREE.Vector3(50, 3, -10),
        size: new THREE.Vector3(0.2, 0.2, 0.2),
        clickable: true
    },
    'Guitar': {
        json: "Guitar.json",
        rot: new THREE.Vector3(0, 0, 0),
        mesh: null,
        angle: new THREE.Vector3(0, 0, 0),
        bboxScale: new THREE.Vector3(4, 15, 4),
        bbox: null,
        pos: new THREE.Vector3(42, 3, 30),
        size: new THREE.Vector3(0.5, 0.5, 0.5),
        clickable: true
    },
    'Ring': {
        json: "Ring.json",
        rot: new THREE.Vector3(0, 0, 0),
        mesh: null,
        angle: new THREE.Vector3(0, 0, 0),
        bboxScale: new THREE.Vector3(8, 4, 4),
        bbox: null,
        pos: new THREE.Vector3(10, 3, 32),
        size: new THREE.Vector3(0.02, 0.02, 0.02),
        clickable: true
    },
    'Notebook': {
        obj: 'Notebook.obj',
        mtl: 'Notebook.mtl',
        rot: new THREE.Vector3(0, 0, 0),
        mesh: null,
        angle: new THREE.Vector3(0, 180, 0),
        bboxScale: new THREE.Vector3(20, 15, 4),
        bbox: null,
        pos: new THREE.Vector3(17, 10, -20),
        size: new THREE.Vector3(0.5, 0.5, 0.5),
        clickable: true
    }
}

export function loadAssets(){
    globals.MODELS = models;

    for(let key of Object.keys(models)){
        if(models[key].mtl){
            // Load Assets
            let mtlLoader = new MTLLoader(globals.LOADING_MANAGER);
            mtlLoader.setPath('/src/models/');
            mtlLoader.load(key + '.mtl', function (materials) {

                materials.preload();
                var objLoader = new OBJLoader(globals.LOADING_MANAGER);
                objLoader.setMaterials(materials);
                objLoader.setPath('/src/models/');
                objLoader.load(key + '.obj', function (object) {
                    models[key].mesh = object;
                    object.castShadow = true;
                    object.receiveShadow = true;
                    object.name = key;
                    console.log(object);
                    globals.SCENE.add(object);
                });
            });
        }
        else{
            const loader = new THREE.ObjectLoader(globals.LOADING_MANAGER);
            loader.setPath('/src/models/');
            loader.load(models[key].json, (object) => {
                console.log(object);
                models[key].mesh = object;
                object.castShadow = true;
                object.receiveShadow = true;
                object.name = key;
                globals.SCENE.add(object);
            });
        }
    }
}

/* function createBboxes(models){
    for(let key of Object.keys(models)){
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial( {color: 0x00FF00, wireframe: true});
        const meshBox = new THREE.Mesh( geometry, material );

        let model = models[key];

        meshBox.scale.copy(model.bboxScale);
        meshBox.name = key + "bbox";
        meshBox.visible = true;
        meshBox.geometry.computeBoundingBox();

        if(key == "Flashlight"){
            console.log(meshBox.position);
            console.log(meshBox.scale);
        }

        model.mesh.add(meshBox);
        model.bbox = meshBox;
    }
} */

export function setAssets(){
    let models = globals.MODELS;
    for(let key of Object.keys(models)){
        if(!models[key].mesh) return;
    }

    //createBboxes(models);

    for(let key of Object.keys(models)){
        let obj = models[key];

        obj.mesh.scale.copy(obj.size);
        if(obj.pos){
            obj.mesh.position.copy(obj.pos);
        }

        if(obj.angle){
            let rotateAngle = new THREE.Vector3(0, 1, 0);
            let rotateQ = new THREE.Quaternion();
            let angle = obj.angle;
            rotateQ.setFromAxisAngle(rotateAngle, angle);
            obj.mesh.quaternion.rotateTowards(rotateQ, angle);
        }

        obj.mesh.rotation.copy(obj.rot);

        if(obj.clickable){
            let clickable = {};
            clickable.mesh = obj.mesh;
            clickable.bbox = new THREE.Box3().setFromObject(obj.mesh);
            clickable.collected = false;
            globals.CLICKABLE_MESHES[key] = clickable;
        }
    }
    globals.ASSETS_LOADED = true;
}

export function resetAssets(){
    for(let key of Object.keys(models)){
        globals.SCENE.remove(models[key].mesh);
        globals.SCENE.add(models[key].mesh);
    }

    setAssets();
}
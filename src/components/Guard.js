import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as THREE from "../../build/three.module.js"
import {globals} from '../globals'
import Detector from './Detector.js';

// in room order (1 to 5)
let positions = [
  new THREE.Vector3(-12, 0, 8),
  new THREE.Vector3(18, 0, 20),
  new THREE.Vector3(10, 0, 26),
  new THREE.Vector3(19, 0, -33),
  new THREE.Vector3(4, 0, -18)
];

class Guard {
  constructor (mesh, roomNum, position, clips, mixer, id) {
    if(mesh){
      this.position = position;
      this.roomNum = roomNum;
      this.speed = Math.random()*3+3;
      this.id = id.toString();
      this.name = 'guard' + this.id;
      this.clips = clips;
      this.direction = new THREE.Vector3(0, 0, 1);
    }
      //this.direction.random();
      this.direction.y = 0;
      this.mixer = mixer;
      this.detector = new Detector(this.position.clone().add(new THREE.Vector3(0, 6, 0)), this.direction.clone(), 10, 30 );
      
      const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
      const material = new THREE.MeshBasicMaterial();
      material.color.setHex(0xFF0000);
      const bboxMesh = new THREE.Mesh( geometry, material );
      bboxMesh.geometry.computeBoundingBox();
      this.mesh = mesh;
      this.mesh.add(bboxMesh);
      bboxMesh.visible = false;
      bboxMesh.position.y += 1;
      bboxMesh.name = 'bbox' + this.id;
  }
  
  static rotate(guard){
    if(guard.direction.z != 0)
      guard.direction.set(-1 * guard.direction.z, 0, guard.direction.x);
    else 
      guard.direction.set(0, 0, guard.direction.x);

    let rotateAngle = new THREE.Vector3(0, 1, 0);
    let rotateQ = new THREE.Quaternion();

    let angle = Math.atan(guard.direction.x / guard.direction.z);
    if(guard.direction.z < 0) angle += Math.PI;

    rotateQ.setFromAxisAngle(rotateAngle, angle);
    guard.mesh.quaternion.rotateTowards(rotateQ, Math.PI);
  }

  static update(guard, delta, collision){
    guard.mixer.update(delta);

    guard.detector.update(guard.mesh.position.clone().add(new THREE.Vector3(0, 3.2, 0)), guard.direction.clone())
    // collision
    if(collision){
      let randomRotation = Math.floor(Math.random()*3 + 1);
      for(let i = 0; i < randomRotation; i++)
        this.rotate(guard);
    }
  }

  static resetGuards(){
    for(let i = 0; i < globals.GUARDS.length; i++){
      let guard = globals.GUARDS[i];
      guard.mesh.position.copy(positions[i]);
    }
  }

  static async setGuards(){
    let scene = globals.SCENE;
    let ghostScene = globals.GHOSTSCENE;
    let ghostBoxes = [];

    for(let i = 0; i < positions.length; i++){
        let positionGuard = positions[i];
        let guard = await Guard.build(i + 1, positionGuard, i);
        if(guard){
            guard.castShadow = true;
            guard.receiveShadow = true;
            
            scene.add(guard.mesh);

            let guardBbox = guard.mesh.children[1];

            const ghostGuard = guardBbox.clone();

            let ghostBox = {}
            ghostGuard.visible = true;
            ghostGuard.position.copy(guard.mesh.position);
            ghostBox.ghost = ghostGuard;
            ghostBox.real = guard.mesh;
       
            ghostBoxes.push(ghostBox);
            ghostScene.add(ghostGuard);

            const clip = THREE.AnimationClip.findByName( guard.clips, 'walk' );
            const action = guard.mixer.clipAction( clip );
            action.play();    
            globals.GUARDS.push(guard);
        }
    }
    globals.GHOSTBOXES = ghostBoxes;
  }

  static async build (roomNumber, position, id) {
      return Guard.loadMesh()
      .then(function(gltf){
        const mesh = gltf.scene;
        
        mesh.traverse((obj) => {
          if(obj.isMesh){
            obj.castShadow = true;
          }
          obj.frustumCulled = false;
        })

        mesh.scale.x *= 4;
        mesh.scale.y *= 4;
        mesh.scale.z *= 4;
        mesh.position.copy(position);

        const mixer = new THREE.AnimationMixer( mesh );
        const clips = gltf.animations;

       return new Guard(mesh, roomNumber, position, clips, mixer, id);
      }).catch(err => console.log("guard couldn't get loaded."));
  }

  static loadMesh(){
    let gltfLoader = new GLTFLoader();
    return gltfLoader.loadAsync("./src/models/XBot.glb", () => {
    })
  }
}

export default Guard;
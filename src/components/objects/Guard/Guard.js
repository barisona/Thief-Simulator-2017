import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as THREE from "../../../build/three.module.js"
import {globals} from '../../globals'
import Detector from '../Detector.js';

class Guard extends Group {
    constructor() {
        super();
        const loader = new GLTFLoader();
        this.name = 'guard';

        loader.load("./XBot.glb", (gltf) => {
            this.add(gltf.scene);
        });
    }


  constructor (mesh, position, clips, mixer, id) {
    if(mesh){
      this.position = position;
      this.speed = Math.random()*3+3;
      this.id = id.toString();
      this.name = 'guard' + this.id;
      this.clips = clips;
      this.direction = new THREE.Vector3(0, 0, 1);
    }
      //this.direction.random();
      this.direction.y = 0;
      this.mixer = mixer;
      this.detector = new Detector(this.position.clone().add(new THREE.Vector3(0, 3.2, 0)), this.direction.clone(), 3.2, 30 );
      
      const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
      const material = new THREE.MeshBasicMaterial({
        wireframe: true
      });
      material.color.setHex(0xFF0000);
      const bboxMesh = new THREE.Mesh( geometry, material );
      bboxMesh.geometry.computeBoundingBox();
      this.mesh = mesh;
      this.mesh.add(bboxMesh);
      bboxMesh.visible = true;
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

  static async setGuards(numGuards){
    let scene = globals.SCENE;
    let ghostScene = globals.GHOSTSCENE;
    let ghostBoxes = [];
    for(let i = 0; i < numGuards; i++){
        let positionGuard = new THREE.Vector3();
        positionGuard.random().multiplyScalar(20).subScalar(10);
        positionGuard.y = 0;
        let guard = await Guard.build(positionGuard, i);
        if(guard){
            guard.castShadow = true;
            guard.receiveShadow = true;
            
            scene.add(guard.mesh);
            scene.add(guard.bbox);

            const ghostGuard = guard.mesh.children[1].clone();

            let ghostBox = {}
            ghostGuard.visible = true;
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

  static async build (position, id) {
      return Guard.loadMesh()
      .then(function(gltf){
        const mesh = gltf.scene;
        
        mesh.traverse((obj) => {
          if(obj.isMesh){
            obj.castShadow = true;
          }
          obj.frustumCulled = false;
        })

        mesh.scale.x *= 2;
        mesh.scale.y *= 2;
        mesh.scale.z *= 2;
        mesh.position.copy(position);

        const mixer = new THREE.AnimationMixer( mesh );
        const clips = gltf.animations;

       return new Guard(mesh, position, clips, mixer, id);
      }).catch(err => console.log("guard couldn't get loaded."));
  }

  static loadMesh(){
    let gltfLoader = new GLTFLoader();
    return gltfLoader.loadAsync("./src/models/XBot.glb", () => {
    })
  }
}

export default Guard;
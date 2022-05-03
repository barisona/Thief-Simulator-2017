import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './house.gltf';

class House extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'house';

        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });
    }
}

export default House;
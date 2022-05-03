import { WebGLRenderer, WebGLRenderTarget, PerspectiveCamera, Vector3, Clock } from 'three';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls.js';
import { SeedScene } from 'scenes';

const clock = new Clock();

export default {
    MAIN_CAMERA: null,
    MINIMAP_CAM: null,
    ROOM_LIGHTS: [],
    LIGHTS_ON: {},
    MODELS: {},
    DOORS: [],
    TIMER: null,
    FLASH_LIGHT: null,
    GHOST_FLASH: null,
    GHOST_CUBE: null,
    GHOST_LIGHTS: {},
    CUR_ROOM: 1,
    CLOCK: clock,
    GUARDS: [],
    END_OF_GAME: null,
    SCENE: null,
    CLICKABLE_MESHES: [],
    CUBE: null,
    PAUSE: true,
    PAUSE_START: 0,
    PAUSE_END: 0,
    TIME_PAUSE: 0,
    GHOSTSCENE: null,
    LOADED: [false, false], //(assets and house)
    GHOSTBOXES: [],
    LOADING_MANAGER: null,
    CLICKABLE: "",
    PLAYER: null,
    GAMEOVER: false,
    DIRECTION: new Vector3(0, 0, 0),
    PREV_POS: new Vector3(0, 0, 0),
    OUTER_CIRCLE: null,
    INNER_CIRCLE: null,
    SWEEPING_CAMERAS: null,
    ITEMS: ['Guitar', 'Diamonds'],
    ITEMS_COPY: ['Guitar', 'Diamonds'], // needed for resetting
    ITEMSLISTHTML: null,
    GAMEWIN: false
}
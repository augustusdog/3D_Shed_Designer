import './style.css';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import * as dat from 'dat.gui'
import { sortInstancedMesh } from 'three/examples/jsm/utils/SceneUtils.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const controls = new OrbitControls(camera, renderer.domElement);

//add grid
scene.add(new THREE.GridHelper(100,20))

//textures
const gardenTexture = new THREE.TextureLoader().load('garden.jpg');
scene.background = gardenTexture;
const brickTexture = new THREE.TextureLoader().load('brick.jpg');
const brickMaterial = new THREE.MeshBasicMaterial({map: brickTexture});

//width geometries
const wallWidth1Geom = new THREE.BoxGeometry(10, 3, 1)
const wallWidth1 = new THREE.Mesh(wallWidth1Geom, brickMaterial)

const wallWidth2Geom = new THREE.BoxGeometry(10, 3, 1)
const wallWidth2 = new THREE.Mesh(wallWidth2Geom, brickMaterial)

wallWidth1.position.set(0,0,0)
wallWidth2.position.set(0,0,10)

scene.add(wallWidth1, wallWidth2)

//depth geometries
const wallDepth1Geom = new THREE.BoxGeometry(1, 3, 10)
const wallDepth1 = new THREE.Mesh(wallDepth1Geom, brickMaterial)

scene.add(wallDepth1)

//initialiseL

const gui = new dat.GUI()

//changing geometry

gui.add(wallWidth1.scale, "x", 0, 2).name('Scale Shed Width')
gui.add(wallWidth1.scale, "y", 0, 2).name('Scale Shed Height')
gui.add(wallWidth1.scale, "y", 0, 2).name('Scale Shed Depth')

function animate(){
  requestAnimationFrame(animate);

  controls.update();
  
  wallWidth2.scale.x = wallWidth1.scale.x;
  wallDepth1.position.x = (wallWidth1.geometry.parameters.width / 2) * wallWidth1.scale.x + wallDepth1.geometry.parameters.width/2
  wallDepth1.position.z = (wallWidth2.position.z / 2) + wallWidth1.geometry.parameters.depth/2

  renderer.render(scene, camera);

}

animate()





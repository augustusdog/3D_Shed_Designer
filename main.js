import './style.css';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import * as dat from 'dat.gui'
import { sortInstancedMesh } from 'three/examples/jsm/utils/SceneUtils.js';
import { depth, ExtrudeGeometry, Triangle, Vector3 } from 'three/webgpu';

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
const wallWidthGeom = new THREE.BoxGeometry(10, 3, 1)
const wallWidth1 = new THREE.Mesh(wallWidthGeom, brickMaterial)
const wallWidth2 = new THREE.Mesh(wallWidthGeom, brickMaterial)

wallWidth1.position.set(0,0,0)
wallWidth2.position.set(0,0,10)

scene.add(wallWidth1, wallWidth2)

//depth geometries
const wallDepthGeom = new THREE.BoxGeometry(1, 3, 11)
const wallDepth1 = new THREE.Mesh(wallDepthGeom, brickMaterial)
const wallDepth2 = new THREE.Mesh(wallDepthGeom, brickMaterial)

wallDepth1.position.set(0,0,0)
wallDepth2.position.set(0,0,0)

scene.add(wallDepth1, wallDepth2)

//add roof - triangular prism

const geometry = new THREE.BufferGeometry();

const vertices = new Float32Array([
    // Front triangle
    -wallWidth1.geometry.parameters.width / 2 - wallDepth1.geometry.parameters.width, wallWidth1.geometry.parameters.height/2, -1*(wallDepth2.geometry.parameters.depth / 2),
    wallWidth1.geometry.parameters.width / 2 + wallDepth1.geometry.parameters.width, wallWidth1.geometry.parameters.height/2, -1*(wallDepth2.geometry.parameters.depth / 2),
    0, wallWidth1.geometry.parameters.height+ 2, -1*(wallDepth2.geometry.parameters.depth / 2),
    // Back triangle
    -wallWidth1.geometry.parameters.width / 2 - wallDepth1.geometry.parameters.width, wallWidth1.geometry.parameters.height/2, wallDepth2.geometry.parameters.depth / 2,
    wallWidth1.geometry.parameters.width / 2 + wallDepth1.geometry.parameters.width, wallWidth1.geometry.parameters.height/2, wallDepth2.geometry.parameters.depth / 2,
    0.5, wallWidth1.geometry.parameters.height+ 2, wallDepth2.geometry.parameters.depth / 2,
]);

// Indices for drawing order
const indices = [
    0, 1, 2,   // Front face
    3, 5, 4,   // Back face
    0, 3, 1,   // Bottom face
    1, 3, 4,
    1, 4, 2,   // Right side
    2, 4, 5,
    2, 5, 0,   // Left side
    0, 5, 3    // Connect back to front
];

geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
geometry.setIndex(indices);
geometry.computeVertexNormals();

// Follow with material and mesh creation
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const prism = new THREE.Mesh(geometry, material);

scene.add(prism);


//initialiseL

const gui = new dat.GUI()

//changing geometry

gui.add(wallWidth1.scale, "x", 0, 2).name('Scale Shed Width')
gui.add(wallWidth1.scale, "y", 0, 2).name('Scale Shed Height')
gui.add(wallDepth1.scale, "z", 0, 2).name('Scale Shed Depth')

function animate(){
  requestAnimationFrame(animate);

  controls.update();
  
  //scaling width
  wallWidth2.scale.x = wallWidth1.scale.x;
  wallDepth1.position.x = (wallWidth1.geometry.parameters.width / 2) * wallWidth1.scale.x + wallDepth1.geometry.parameters.width / 2
  wallDepth2.position.x = - wallDepth1.position.x
  wallDepth1.position.z = wallDepth2.position.z = (wallWidth2.position.z / 2) //+ wallWidth1.geometry.parameters.depth/2

  
  //scaling height
  wallWidth2.scale.y = wallDepth1.scale.y = wallDepth2.scale.y = wallWidth1.scale.y;

  //scaling depth
  wallDepth2.scale.z = wallDepth1.scale.z
  wallDepth1.position.z = wallDepth2.position.z = 0 //reset position of origin to zero as per Grok's advice - means not scaled by disproportionate amount to one side
  wallWidth1.position.z = - 1 * ((wallDepth1.geometry.parameters.depth / 2) * wallDepth1.scale.z) + wallWidth1.geometry.parameters.depth / 2
  wallWidth2.position.z = (wallDepth1.geometry.parameters.depth / 2) * wallDepth1.scale.z - wallWidth2.geometry.parameters.depth / 2

  //scaling roof

  renderer.render(scene, camera);

}

animate()





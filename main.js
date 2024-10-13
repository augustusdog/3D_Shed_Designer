import './style.css';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// // add document listener for user input
// document.addEventListener('DOMContentLoaded', function)(){
//   const widthInput = document.getElementById('width_input');
// }

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
const material = new THREE.MeshStandardMaterial( { color: 0xFF6347} );
const torus = new THREE.Mesh( geometry, material );

// scene.add(torus)

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5)

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight)

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200,50);
scene.add(lightHelper, gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);

const gardenTexture = new THREE.TextureLoader().load('garden.jpg');
scene.background = gardenTexture;

const brickTexture = new THREE.TextureLoader().load('brick.jpg');
const wall1 = new THREE.Mesh(
  new THREE.BoxGeometry(10,3,1),
  new THREE.MeshBasicMaterial({map: brickTexture})
);

wall1.position.set(0,0,0)

const wall2 = new THREE.Mesh(
  new THREE.BoxGeometry(1,3,8),
  new THREE.MeshBasicMaterial({map: brickTexture})
);

// Positioning wall2 to be at right angle to wall1
wall2.position.x = -1 + wall1.geometry.parameters.width / 2 + wall2.geometry.parameters.width / 2;
wall2.position.z = (0.5*wall1.geometry.parameters.depth) + wall2.geometry.parameters.depth / 2; // Half of wall2's depth to align at center

//create wall 3 to emulate wall 1 but be otherside of wall 2
const wall3 = new THREE.Mesh(
  new THREE.BoxGeometry(wall1.geometry.parameters.width,wall1.geometry.parameters.height,wall1.geometry.parameters.depth),
  new THREE.MeshBasicMaterial({map: brickTexture})
);

wall3.position.x = wall1.position.x;
wall3.position.y = wall1.position.y;
wall3.position.z = wall2.geometry.parameters.width + wall2.geometry.parameters.depth

//create wall 4 to emulate wall 4 but be otherside of wall 1 and wall 3
const wall4 = new THREE.Mesh(
  new THREE.BoxGeometry(wall2.geometry.parameters.width,wall2.geometry.parameters.height,wall2.geometry.parameters.depth),
  new THREE.MeshBasicMaterial({map: brickTexture})
);

wall4.position.x = 1 + wall2.position.x - wall1.geometry.parameters.width
wall4.position.y = wall2.position.y
wall4.position.z = wall2.position.z

//add roof
const roof_overhang = 0.5;
const roof_thickness = 1;

const blackTexture = new THREE.TextureLoader().load('black.jpg');

const roof = new THREE.Mesh(
  new THREE.BoxGeometry(wall1.geometry.parameters.width + 2*roof_overhang, roof_thickness, wall2.geometry.parameters.depth + 2*wall1.geometry.parameters.depth + 2*roof_overhang),
  new THREE.MeshBasicMaterial({map: blackTexture})
);

roof.position.x = wall1.position.x
roof.position.z = wall2.position.z
roof.position.y = roof.geometry.parameters.height / 2 + wall1.geometry.parameters.height / 2


scene.add(wall1, wall2, wall3, wall4, roof);

function animate(){
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate()





import './style.css';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import * as dat from 'dat.gui'

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
const brickMaterial = new THREE.MeshBasicMaterial({color: 0x000000, map: brickTexture});
const tilesTexture = new THREE.TextureLoader().load("tiles.jpg")
const tilesMaterial = new THREE.MeshBasicMaterial({ map: tilesTexture});
const blackMaterial = new THREE.MeshBasicMaterial({ color: 0x000000});
blackMaterial.side = THREE.DoubleSide;
tilesMaterial.side = THREE.DoubleSide;

///////////////////////initialisation of geometries//////////////////////////////////////

//CREATION OF WALLS
//width geometries
const wallWidthGeom = new THREE.BoxGeometry(10, 3, 1)
const wallWidth1 = new THREE.Mesh(wallWidthGeom, brickMaterial)
const wallWidth2 = new THREE.Mesh(wallWidthGeom, brickMaterial)

console.log(wallWidth1.material.color.getHexString())

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

//CREATION OF ROOF
//for ease of UV mapping decided to build up from two rectangular slopes

const geometry1 = new THREE.BufferGeometry();
const geometry2 = new THREE.BufferGeometry();
const geometry3 = new THREE.BufferGeometry();

const vertices_1 = new Float32Array([
  // Slope 1
  wallWidth1.geometry.parameters.width / 2 + wallDepth1.geometry.parameters.width, wallWidth1.geometry.parameters.height/2, -1*(wallDepth2.geometry.parameters.depth / 2),
  0, wallWidth1.geometry.parameters.height+ 2, -1*(wallDepth2.geometry.parameters.depth / 2),
  wallWidth1.geometry.parameters.width / 2 + wallDepth1.geometry.parameters.width, wallWidth1.geometry.parameters.height/2, wallDepth2.geometry.parameters.depth / 2,
  0, wallWidth1.geometry.parameters.height+ 2, wallDepth2.geometry.parameters.depth / 2,
]);
  //Slope 2
const vertices_2 = new Float32Array([
  -wallWidth1.geometry.parameters.width / 2 - wallDepth1.geometry.parameters.width, wallWidth1.geometry.parameters.height/2, -1*(wallDepth2.geometry.parameters.depth / 2),
  0, wallWidth1.geometry.parameters.height+ 2, -1*(wallDepth2.geometry.parameters.depth / 2),
  -wallWidth1.geometry.parameters.width / 2 - wallDepth1.geometry.parameters.width, wallWidth1.geometry.parameters.height/2, wallDepth2.geometry.parameters.depth / 2,
  0, wallWidth1.geometry.parameters.height+ 2, wallDepth2.geometry.parameters.depth / 2,
])
// end bits
const vertices_3 = new Float32Array([
  // Front triangle
  -wallWidth1.geometry.parameters.width / 2 - wallDepth1.geometry.parameters.width, wallWidth1.geometry.parameters.height/2, -1*(wallDepth2.geometry.parameters.depth / 2),
  wallWidth1.geometry.parameters.width / 2 + wallDepth1.geometry.parameters.width, wallWidth1.geometry.parameters.height/2, -1*(wallDepth2.geometry.parameters.depth / 2),
  0, wallWidth1.geometry.parameters.height+ 2, -1*(wallDepth2.geometry.parameters.depth / 2),
  // Back triangle
  -wallWidth1.geometry.parameters.width / 2 - wallDepth1.geometry.parameters.width, wallWidth1.geometry.parameters.height/2, wallDepth2.geometry.parameters.depth / 2,
  wallWidth1.geometry.parameters.width / 2 + wallDepth1.geometry.parameters.width, wallWidth1.geometry.parameters.height/2, wallDepth2.geometry.parameters.depth / 2,
  0, wallWidth1.geometry.parameters.height+ 2, wallDepth2.geometry.parameters.depth / 2,
])

// Indices for drawing order for roof slope 1 and 2
const indices = [
    0, 1, 2,
    2, 3, 1
];

const indices_endBits = [
  0, 1, 2,
  3, 4, 5
]

// UV coordinate mapping for roof slope 1 and 2
const uvs = new Float32Array([
  1, 0,
  1, 1,
  0, 0,
  0, 1
])

geometry1.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
geometry1.setAttribute('position', new THREE.BufferAttribute(vertices_1, 3));
geometry1.setIndex(indices);
geometry1.computeVertexNormals();

geometry2.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
geometry2.setAttribute('position', new THREE.BufferAttribute(vertices_2, 3));
geometry2.setIndex(indices);
geometry2.computeVertexNormals();

geometry3.setAttribute('position', new THREE.BufferAttribute(vertices_3, 3));
geometry3.setIndex(indices_endBits);
geometry3.computeVertexNormals

const slope1 = new THREE.Mesh(geometry1, tilesMaterial);
const slope2 = new THREE.Mesh(geometry2, tilesMaterial);
const endBits = new THREE.Mesh(geometry3, tilesMaterial)

//DYNAMICALLY ADJUST ROOF FUNCTION

function updatePrism() {
  const width = (wallWidth1.scale.x * wallWidth1.geometry.parameters.width + 2*wallDepth1.geometry.parameters.width)/2;
  const height = (wallWidth1.scale.y * wallWidth1.geometry.parameters.height)/2;
  const depth = (wallDepth2.scale.z * wallDepth2.geometry.parameters.depth)/2;

  // Update vertex positions here using `width`, `height`, and `depth`.
  // For example, for the first vertex of the front triangle:

  //roof slope 1
  geometry1.attributes.position.setXYZ(0, width, height, -depth); //vertex 2
  geometry1.attributes.position.setXYZ(1, 0, (2*height)+1, -depth) //vertex 3
  geometry1.attributes.position.setXYZ(2, width, height, depth); //vertex 2
  geometry1.attributes.position.setXYZ(3, 0, (2*height)+1, depth) //vertex 3

  geometry1.attributes.position.needsUpdate = true;
  geometry1.computeVertexNormals();

  //roof slope 2
  geometry2.attributes.position.setXYZ(0, -width, height, -depth); //vertex 2
  geometry2.attributes.position.setXYZ(1, 0, (2*height)+1, -depth) //vertex 3
  geometry2.attributes.position.setXYZ(2, -width, height, depth); //vertex 2
  geometry2.attributes.position.setXYZ(3, 0, (2*height)+1, depth) //vertex 3

  geometry2.attributes.position.needsUpdate = true;
  geometry2.computeVertexNormals();

  //endBits
  geometry3.attributes.position.setXYZ(0, width, height, -depth);
  geometry3.attributes.position.setXYZ(1, -width, height, -depth);
  geometry3.attributes.position.setXYZ(2, 0, (2*height)+1, -depth);
  geometry3.attributes.position.setXYZ(3, width, height, depth);
  geometry3.attributes.position.setXYZ(4, -width, height, depth);
  geometry3.attributes.position.setXYZ(5, 0, (2*height)+1, depth);

  geometry3.attributes.position.needsUpdate = true;
  geometry3.computeVertexNormals();
}
scene.add(slope1, slope2, endBits);

///////////////////////User interface//////////////////////////////////////

//CREATION OF USER INTERFACE

const gui = new dat.GUI()

gui.add(wallWidth1.scale, "x", 0.5, 2).name('Scale Shed Width')
gui.add(wallWidth1.scale, "y", 0.5, 2).name('Scale Shed Height')
gui.add(wallDepth1.scale, "z", 0.5, 2).name('Scale Shed Depth')

const colorParams = {
  color: '#000000' // Hex string for white, initial color
};

// Function to update the wall colour
function updateColor() {
  // Convert hex to a number for Three.js color
  const colorValue = colorParams.color.replace('#', '0x');
  wallWidth1.material.color.set(parseInt(colorValue, 16));
}

// Add a color picker to the GUI
gui.addColor(colorParams, 'color').name('Colour of Walls').onChange(updateColor);


///////////////////////Render function//////////////////////////////////////
//ANIMATE FUNCTION
//////////////////

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
  updatePrism()

  renderer.render(scene, camera);

}

animate()





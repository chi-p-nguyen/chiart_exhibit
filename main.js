import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import axios from 'axios';

// SCENE
const scene = new THREE.Scene();

// CAMERA
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setX(-30);
camera.position.setZ(50);

renderer.render(scene, camera);

// GEOMETRY
const loader = new THREE.TextureLoader();

// Background
scene.background = loader.load('img/sky.jpg');

// Get img array from server
const url = process.env.NODE_ENV === "production" ? "https://chiart.onrender.com" : "https://chiart.onrender.com";
let imgArray = [];
const imgCubes = [];

axios.get(`${url}/files`)
.then((response) => {
    imgArray = response.data.map(element => `${url}/image/${element.filename}`);
    
    for (let i=0; i < imgArray.length; i++) {
      const geometry = new THREE.BoxGeometry(5, 5, 5);
      const material = new THREE.MeshBasicMaterial({ map: loader.load(imgArray[i]) });
      const mesh = new THREE.Mesh(geometry, material);
    
      const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ));
      mesh.position.set(x, y, z);
    
      imgCubes.push(mesh);
      scene.add(mesh);
    }
})
.catch((error) => console.log(error))

// Lighting
var ambientLight = new THREE.AmbientLight(0x404040); // Adjust the color as needed
scene.add(ambientLight);


const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);

  for (let cube of imgCubes) {
    cube.rotation.x += 0.01 * Math.random();
    cube.rotation.y += 0.005 * Math.random();
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.position.z = t * 1;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

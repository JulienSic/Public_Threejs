import './styles.css';
import * as THREE from 'three';

// RawShaderMaterial related ------
// import vertexShader from './src/assets/shaders/my-shaders/vertex.glsl';
// import fragmentShader from './src/assets/shaders/my-shaders/fragment.glsl';

const container = document.getElementById('canvas-container');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);


// Colors ------
const waterBlue = 0x4CABCA;
const moonGrey = 0xB2C7D4;
const sandOrange = 0xE8A71C;
const sunYellow = 0xF7EC4F;
const sunEmissive = 0xF7B934;
const lighMarkerColor = 0xF5F5F5;
const mainLighColor = 0xF5F0E6;
const shadowLightColor = 0x661D6E ;

// Positions ------

// Sun
const sunX = 0;
const sunY = 0;
const sunZ = 0;

// Earth
const earthX = 10;
const earthY = 0;
const earthZ = 0;

// Moon
const moonX = 2;
const moonY = 0;
const moonZ = 0;

// Main Ligh
const mainX = 8;
const mainY = 8;
const mainZ = 1;


// Shadow Light
const shadowX = -8;
const shadowY = -10;
const shadowZ = -4;

// Sun Ligh
const sunLX = 8;
const sunLY = 8;
const sunLZ = 1;


//Scene elements ------

// Geometry
const earthGeo = new THREE.IcosahedronGeometry(1, 10, 32, 32);
const moonGeo = new THREE.IcosahedronGeometry(0.4, 6, 32, 32);
const sunGeo = new THREE.IcosahedronGeometry(4, 10, 32, 32);
const lightMarkGeo = new THREE.BoxGeometry(1,1,1)

// Lights
const globalLight = new THREE.AmbientLight(mainLighColor, 0.06);
const mainLight = new THREE.PointLight(mainLighColor, 50, 100);
const shadowLight = new THREE.PointLight(shadowLightColor, 50, 200);
const sunLight = new THREE.PointLight(sunEmissive, 100, 500);

// Materials
const earthMaterial = new THREE.MeshStandardMaterial({

  //MeshStandardMaterial
  color: waterBlue,
  roughness: 0.7,
  metalness: 0.2,

  flatShading: true,

  // RawShaderMaterial related ------
  // vertexShader: vertexShader,
  // fragmentShader: fragmentShader,
  // uniforms: {
  //   uTime: { value:0 }
  // },
  side: THREE.DoubleSide,
 });

 const moonMaterial = new THREE.MeshStandardMaterial({

  //MeshStandardMaterial
  color: moonGrey,
  roughness: 0.7,
  metalness: 0.2,

  flatShading: true,

  side: THREE.DoubleSide,
 });

 const sunMaterial = new THREE.MeshStandardMaterial({

  //MeshStandardMaterial
  color: sunYellow,
  emissive: sunEmissive,
  emissiveIntensity: 0.4,
  roughness: 0.7,
  metalness: 0.2,

  flatShading: true,

  side: THREE.DoubleSide,
 });

 const lighMarkerMaterial = new THREE.MeshStandardMaterial({

  //MeshStandardMaterial
  color: lighMarkerColor,
  emissive: lighMarkerColor,
  emissiveIntensity: 0.5,
  roughness: 0.7,
  metalness: 0.2,

  flatShading: true,

  side: THREE.DoubleSide,
 });



// Meshes
const earthMesh = new THREE.Mesh(earthGeo, earthMaterial);
const moonMesh = new THREE.Mesh(moonGeo, moonMaterial);
const sunMesh = new THREE.Mesh(sunGeo, sunMaterial);
const lightMarkerMainMesh = new THREE.Mesh(lightMarkGeo, lighMarkerMaterial);
const lightMarkerShadowMesh = new THREE.Mesh(lightMarkGeo, lighMarkerMaterial);

// Adding in Scene ------
scene.add(earthMesh);
scene.add(moonMesh);
scene.add(sunMesh);
scene.add(globalLight);
// scene.add(mainLight);
// scene.add(shadowLight);
scene.add(sunLight);
scene.add(lightMarkerMainMesh);
scene.add(lightMarkerShadowMesh);

// Parenting
moonMesh.parent = earthMesh;
earthMesh.parent = sunMesh;
lightMarkerMainMesh.parent = mainLight;
lightMarkerShadowMesh.parent = shadowLight;

// Moving objects in the scene ------


//Meshes
moonMesh.position.x = moonX;
moonMesh.position.y = moonY;
moonMesh.position.z = moonZ;

earthMesh.position.x = earthX;
earthMesh.position.y = earthY;
earthMesh.position.z = earthZ;

sunMesh.position.x = sunX;
sunMesh.position.y = sunY;
sunMesh.position.z = sunZ;

//Camera
camera.position.z = 15;

//MainLight
mainLight.position.y = mainX;
mainLight.position.x = mainY;
mainLight.position.z = mainZ;

//Shadowlight
shadowLight.position.y = shadowX;
shadowLight.position.x = shadowY;
shadowLight.position.z = shadowZ;


window.addEventListener('resize', () => {
    // Update camera
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

function render() {
  requestAnimationFrame(render);

  //  cube.rotation.x += 0.01;
  earthMesh.rotation.y += 0.005;
  earthMesh.rotation.z

  sunMesh.rotation.y += 0.005;


  // if (timestamp) {
  //   material.uniforms.uTime.value = timestamp / 1000;
  // }

  renderer.render(scene, camera);
}

render();   

//console.log(material);


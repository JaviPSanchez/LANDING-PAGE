import "./styles/main.scss";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import gsap from "gsap";

const vertexShader = `
varying vec2 vUv;
void main()	{
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`;
const fragmentShader = `
//#extension GL_OES_standard_derivatives : enable

varying vec2 vUv;
uniform float thickness;

float edgeFactor(vec2 p){
  vec2 grid = abs(fract(p - 0.5) - 0.5) / fwidth(p) / thickness;
  return min(grid.x, grid.y);
}
void main() {
  float a = edgeFactor(vUv);
  vec3 c = mix(vec3(1), vec3(0), a);
  gl_FragColor = vec4(c, 1.0);
}
`;

///////DEBUG/////

const gui = new dat.GUI();

///////CANVAS//////

const canvas = document.querySelector("canvas.webgl");

///////SCENE//////

const scene = new THREE.Scene();
// scene.background = new THREE.Color(0x00000);
scene.fog = new THREE.FogExp2(0xffffff, 0.1);

///////////CAMERA//////////

const fieldOfView = 75;
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
let aspectRatio = WIDTH / HEIGHT;
const nearClippingPlane = 0.1;
const farClippingPlane = 1000;

const camera = new THREE.PerspectiveCamera(
  fieldOfView,
  aspectRatio,
  nearClippingPlane,
  farClippingPlane
);
camera.position.set(0, 0, 50);

////////////OBJECTS//////////////

////FLOOR

const floorGeometry = new THREE.BoxGeometry(20, 0.1, 20);
const floorMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
scene.add(floor);

////BUILDINGS

const cube = [];
for (let i = 0; i < 1000; ++i) {
  const rHeight = Math.random() * 6;
  const geometry = new THREE.BoxGeometry(0.3, rHeight, 0.3);
  // const cubeMaterial = new THREE.MeshLambertMaterial({
  //   color: 0xffffff,
  //   transparent: true,
  //   opacity: 0.5,
  // });
  const cubeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      thickness: {
        value: 1.5,
      },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });
  cube[i] = new THREE.Mesh(geometry, cubeMaterial);
  floor.add(cube[i]);

  const x = (Math.random() * (10.0 - -10) + -10).toFixed(2);
  const y = 0;
  const z = (Math.random() * (10.0 - -10) + -10).toFixed(2);
  cube[i].position.set(x, y, z);
}

///////////ORBIT//////////

new OrbitControls(camera, canvas);

///////////RENDER//////////

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});

renderer.setClearColor(0xffffff);
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector("body").append(renderer.domElement);

window.addEventListener("resize", onResize);
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

////////CAMERA///////

camera.position.set(0, 3, 10);

////////LIGHTS///////

var light1 = new THREE.DirectionalLight(0xffffff, 1);
scene.add(light1);
light1.position.set(1.5, 2, 1);

var light1 = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(light1);
light1.position.set(-1.5, 2, 1);

var distance = 0;
var floorRotation = 1;
var cameraPosition = 1;
var easingAmount = 0.001;

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);

  //move camera and city to mouse movement slowly
  const xDistance = floorRotation - floor.rotation.y;
  const yDistance = cameraPosition - camera.position.z;
  distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
  if (distance > 0) {
    floor.rotation.y += xDistance * easingAmount;
    camera.position.z += yDistance * easingAmount;
  }
}
render();

//////////GSAP//////////

gsap.to("#JaviPS", {
  opacity: 1,
  duration: 1.5,
  y: 0,
  ease: "expo",
});
gsap.to("#Description", {
  opacity: 1,
  duration: 1.5,
  delay: 0.3,
  y: 0,
  ease: "expo",
});
gsap.to("#viewWorkBtn", {
  opacity: 1,
  duration: 1.5,
  delay: 0.6,
  y: 0,
  ease: "expo",
});

document.querySelector("#viewWorkBtn").addEventListener("click", (e) => {
  e.preventDefault();
  gsap.to(".app", {
    opacity: 0,
    duration: 1.5,
    delay: 0.6,
    y: 0,
    ease: "expo",
  });
  gsap.to(camera.position, {
    z: 10000,
    ease: "power3.inOut",
    duration: 1.5,
    onComplete: () => {
      window.location.assign("https://javipsanchez.netlify.app/");
    },
  });
});

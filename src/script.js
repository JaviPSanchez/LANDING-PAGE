import "./styles/main.scss";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import gsap from "gsap";

////////////////CARDS/////////////////

var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xffffff, 0.13);

var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  15
);

var renderer = new THREE.WebGLRenderer({
  antialias: true,
});

renderer.setClearColor(0xffffff);
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector("body").append(renderer.domElement);

// window.onresize = function () {
//   onWindowResize;
// };

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

//Floor
var floorG = new THREE.BoxGeometry(20, 0.1, 20);
// var floorM = new THREE.MeshLambertMaterial({ color: 0x204555 });
var floorM = new THREE.MeshLambertMaterial({ color: 0x000000 });
var floor = new THREE.Mesh(floorG, floorM);
scene.add(floor);

//Buildings
var cube = [];
for (var i = 0; i < 1000; ++i) {
  var rHeight = Math.random() * 8 + 0.25;
  var geometry = new THREE.BoxGeometry(0.25, rHeight, 0.25);
  var material = new THREE.MeshLambertMaterial({ color: 0x000000 });
  material.transparent = true;
  material.opacity = 0.5;
  cube[i] = new THREE.Mesh(geometry, material);
  floor.add(cube[i]);

  var x = (Math.random() * (10.0 - -10) + -10).toFixed(2);
  var y = 0;
  var z = (Math.random() * (10.0 - -10) + -10).toFixed(2);
  cube[i].position.set(x, y, z);
}

//camera
camera.position.set(0, 3, 10);

//lights
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
  var xDistance = floorRotation - floor.rotation.y;
  var yDistance = cameraPosition - camera.position.z;
  distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
  if (distance > 0) {
    floor.rotation.y += xDistance * easingAmount;
    camera.position.z += yDistance * easingAmount;
  }
}
render();

//Animaciones con GSAP

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
    duration: 3,
    onComplete: () => {
      window.location.assign("https://javipsanchez.netlify.app/");
    },
  });
  /*
  gsap.to(camera.rotation, {
    x: Math.PI / 2,
    ease: "power3.inOut",
    duration: 2,
  });
  gsap.to(camera.position, {
    y: 1000,
    ease: "power3.in",
    duration: 1,
    delay: 2,
    onComplete: () => {
      window.location.assign("https://javipsanchez.netlify.app/");
    },
  });
  */
});

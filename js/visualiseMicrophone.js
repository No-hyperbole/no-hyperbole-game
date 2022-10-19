import { VRButton } from "../three.js build/VRButton.js";

function main() {
  // microphoneInput.js
  const microphone = new Microphone();

  // three.js
  const bgColor = 0x587980;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(bgColor, 30, 100);
  scene.background = new THREE.Color(bgColor);
  let camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
  );
  camera.position.set(0, 5, 20);

  // renderer
  let canvas = document.getElementById("three.js");
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true; // we have to enable xr in order to allow for VR session
  document.body.appendChild(renderer.domElement);
  addEventListener("resize", (event) => {
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // user (VR entity)
  let user = new THREE.Group();
  user.position.set(0, 0, 0);
  user.add(camera);
  scene.add(user);

  // surface
  const surface = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshBasicMaterial({ color: 0xdcddd8, side: THREE.DoubleSide })
  );
  surface.rotation.x = Math.PI / 2;
  scene.add(surface);

  // bird mesh
  let birdMesh = null;
  const loader = new THREE.GLTFLoader(); //using gltf, since it has texture data hardcoded
  loader.load("./3D assets/bird.glb", function (bird) {
    birdMesh = bird.scene;
    birdMesh.position.set(0, 5, -5);
    birdMesh.rotation.y = Math.PI * 0.5;
    birdMesh.scale.set(2, 2, 2);
    scene.add(birdMesh);
  });

  function makeOneFloralPlane(x, z, size) {
    const textureFileAmount = materialArray.length;
    const material = materialArray[getRandomInt(textureFileAmount) - 1]; // random png file as texture
    const geometry = new THREE.PlaneGeometry(size, size);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    plane.position.x = x;
    plane.position.y = size / 2;
    plane.position.z = z;
    plane.rotation.y = Math.PI * (getRandomInt(18) * 0.1);
    return plane;
  }

  function makeOnePlaneShadow(x, z, size) {
    // add shadow beneath the floral plane
    const shadowGeometry = new THREE.CircleGeometry(size / 5, 10);
    const shadowMaterial = new THREE.MeshBasicMaterial({
      color: 0x121718,
      opacity: 1,
      side: THREE.DoubleSide,
    });
    const shadowCircle = new THREE.Mesh(shadowGeometry, shadowMaterial);
    scene.add(shadowCircle);
    shadowCircle.position.x = x;
    shadowCircle.position.y = 0.1;
    shadowCircle.position.z = z;
    shadowCircle.rotation.x = Math.PI / 2;
    return shadowCircle;
  }

  function makeOneIsland(x, z, size) {
    // randomize the landscape a bit
    const islandGeometry = new THREE.CircleGeometry(size, getRandomInt(10));
    const islandMaterial = new THREE.MeshBasicMaterial({
      color: 0x76716a,
      opacity: 1,
      side: THREE.DoubleSide,
    });
    const islandCircle = new THREE.Mesh(islandGeometry, islandMaterial);
    scene.add(islandCircle);
    islandCircle.position.x = x;
    islandCircle.position.y = 0.05;
    islandCircle.position.z = z;
    islandCircle.rotation.x = Math.PI / 2;
    return islandCircle;
  }

  // planes go into an array, in which we can set the max amount of exising entities
  function createPlanes(amount, distanceFromStart) {
    //shadow planes, floral planes and island planes
    const size = getRandomInt(10); // we generate only one random number, so the aspect ratio is 1:1
    for (let i = 0; i < amount; i++) {
      let x = getRandomInt(30);
      let z = getRandomInt(20) * -1 - distanceFromStart;
      let leftOrRight = getRandomInt(2); // since we start our local reference point at 0,0,0, we have to put some planes on the left, and some on the right. getRandomInt function only generates integers.
      if (leftOrRight % 2 === 0) {
        x = x * -1;
      }
      planeArray.push(makeOneFloralPlane(x, z, size));
      planeShadowArray.push(makeOnePlaneShadow(x, z, size));
      islandArray.push(makeOneIsland(x, z, size));
    }
  }
  createPlanes(howManyPlanesExistOnStart, 0);

  // light
  const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  scene.add(light);

  //clock
  let clock = new THREE.Clock();

  // gameloop
  function animate() {
    renderer.setAnimationLoop(function () {
      renderer.render(scene, camera);
      gameLoop();
    });
  }

  const gameLoop = () => {
    elapsedTime = clock.getElapsedTime();
    elapsedTimeDelta = clock.getDelta();
    const volume = microphone.getVolume();
    if (volume) {
      if (birdMesh !== null) {
        birdMesh.position.z -= elapsedTimeDelta + volume; // this way the birdmesh stays always in the same distance away from the viewer
        surface.position.z -= elapsedTimeDelta + volume;
        user.position.z -= elapsedTimeDelta + volume; // this way the camera stays always in the same place
        if (
          Math.ceil(elapsedTime) % howManySecoundsToAddFlowers === 0 &&
          !calledTemp // we only get into this if block once, since we append new objects into the scene only once per the specified interval in the "howManySecoundsToAddFlowers" variable
        ) {
          calledTemp = true; // we remember, that we've been in that if, so we won't call it on the new screen refrest
          for (let i = 0; i < howManyPlanesAreAddedAndRemoved; i++) {
            if (planeArray.length >= maxPlanesAmount) {
              // we start with a set amount of floral planes, but we add to that amount until we exceed a set threshold
              scene.remove(planeArray.shift());
              scene.remove(islandArray.shift());
              scene.remove(planeShadowArray.shift());
            }
            createPlanes(1, birdMesh.position.z * -1);
          }
        }
        if (Math.floor(elapsedTime) % howManySecoundsToAddFlowers === 0) {
          // HACK: we reset the calledTemp variable, so we can add new objects when the new interval ends
          calledTemp = false;
        }
        console.log(user.position.z);
      }
    }
    renderer.render(scene, camera);
  };

  animate();

  document.body.appendChild(VRButton.createButton(renderer));
}

main();

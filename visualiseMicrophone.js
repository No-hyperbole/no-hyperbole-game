function main() {
  // game constants
  let elapsedTime = 0;
  let howManySecoundsToAddFlowers = 3;
  let calledTemp = false; // this variable allows me to get into the "elapsedtime if" in the animate function (gameloop) only once, not on every screen refresh that matches the modulo operand
  let elapsedTimeDelta = 0;
  let howManyPlanesExistOnStart = 20;
  let maxPlanesAmount = 100;
  let planeArray = []; // here we will store all the planes with floral textures on them
  let howManyPlanesAreAddedAndRemoved = 4;

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
    0.1,
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
  document.body.appendChild(renderer.domElement);
  addEventListener("resize", (event) => {
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // surface
  const surface = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshBasicMaterial({ color: 0x76716a, side: THREE.DoubleSide })
  );
  surface.rotation.x = Math.PI / 2;
  scene.add(surface);

  // bird mesh
  var birdMesh = null;
  const loader = new THREE.GLTFLoader(); //using gltf, since it has texture data hardcoded
  loader.load("./3D assets/untitled.glb", function (bird) {
    birdMesh = bird.scene;
    scene.add(birdMesh);
    render();
  });

  var materialArray = [];
  materialArray.push(
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("./3D assets/textures/floral1.png"),
      transparent: true,
      opacity: 1,
      color: 0xffffff,
    })
  );

  function getRandomInt(maxVal) {
    return Math.ceil(Math.random() * maxVal);
  }

  // planes go into an array, in which we can set the max amount of exising entities
  function makeOnePlane(x, z) {
    const textureFileAmount = materialArray.length;
    const material = materialArray[getRandomInt(textureFileAmount) - 1]; // random png file as texture
    const size = getRandomInt(10); // we generate only one random number, so the aspect ratio is 1:1
    const geometry = new THREE.PlaneGeometry(size, size);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    plane.position.x = x;
    plane.position.y = size / 2;
    plane.position.z = z;
    return plane;
  }

  function createPlanes(amount, distanceFromStart) {
    for (let i = 0; i < amount; i++) {
      let x = getRandomInt(30);
      let z = getRandomInt(20) * -1 - distanceFromStart;
      let leftOrRight = getRandomInt(2); // since we start our local reference point at 0,0,0, we have to put some planes on the left, and some on the right. getRandomInt function only generates integers.
      if (leftOrRight % 2 === 0) {
        x = x * -1;
      }
      planeArray.push(makeOnePlane(x, z));
    }
  }
  createPlanes(howManyPlanesExistOnStart, 0);

  // light
  const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  scene.add(light);

  //clock
  let clock = new THREE.Clock();

  // gameloop
  function render() {
    renderer.render(scene, camera);
  }

  const animate = () => {
    elapsedTime = clock.getElapsedTime();
    elapsedTimeDelta = clock.getDelta();
    requestAnimationFrame(animate);
    const volume = microphone.getVolume();
    if (volume) {
      if (birdMesh !== null) {
        birdMesh.position.z -= elapsedTimeDelta + volume; // this way the birdmesh stays always in the same distance away from the viewer
        camera.position.z -= elapsedTimeDelta + volume; // this way the camera stays always in the same place
        if (
          Math.ceil(elapsedTime) % howManySecoundsToAddFlowers === 0 &&
          !calledTemp // we only get into this if block once, since we append new objects into the scene only once per the specified interval in the "howManySecoundsToAddFlowers" variable
        ) {
          calledTemp = true; // we remember, that we've been in that if, so we won't call it on the new screen refrest
          for (let i = 0; i < howManyPlanesAreAddedAndRemoved; i++) {
            if (planeArray.length >= maxPlanesAmount) {
              // we start with a set amount of floral planes, but we add to that amount until we exceed a set threshold
              scene.remove(planeArray.shift());
            }
            createPlanes(1, birdMesh.position.z * -1);
            console.log(planeArray.length);
          }
        }
        if (Math.floor(elapsedTime) % howManySecoundsToAddFlowers === 0) {
          // HACK: we reset the calledTemp variable, so we can add new objects when the new interval ends
          calledTemp = false;
        }
      }
    }
    render();
  };

  animate();
}

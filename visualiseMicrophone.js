function main() {
  // microphoneInput.js
  const microphone = new Microphone();

  // three.js
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  let camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 20);

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

  // bird mesh
  var birdMesh = null;
  const loader = new THREE.GLTFLoader(); //using gltf, since it has texture data hardcoded
  loader.load("./3D assets/untitled.glb", function (bird) {
    console.log(bird.scene);
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
      color: 0xff0000,
    })
  );

  function getRandomIntWhichIsMax3() {
    return Math.ceil(Math.random() * 3);
  }

  // plane geometry TODO: push planeGeometry into an array, and loop through it
  const plane1 = new THREE.Mesh(
    new THREE.PlaneGeometry(
      getRandomIntWhichIsMax3(),
      getRandomIntWhichIsMax3()
    ),
    materialArray[0]
  );
  plane1.position.z = 10;
  scene.add(plane1);
  const plane2 = new THREE.Mesh(
    new THREE.PlaneGeometry(
      getRandomIntWhichIsMax3(),
      getRandomIntWhichIsMax3()
    ),
    materialArray[0]
  );
  plane2.position.x = -10;
  scene.add(plane2);

  // light
  const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  scene.add(light);

  //clock
  let clock = new THREE.Clock();

  // gameloop
  function render() {
    renderer.render(scene, camera);
  }

  // game constants
  let elapsedTime = 0;
  let howManySecoundsToAddFlowers = 3;
  let calledTemp = false; // this variable allows me to get into the "elapsedtime if" in the animate function (gameloop) only once, not on every screen refresh that matches the modulo operand
  let elapsedTimeDelta = 0;

  const animate = () => {
    elapsedTime = clock.getElapsedTime();
    elapsedTimeDelta = clock.getDelta();
    requestAnimationFrame(animate);
    const volume = microphone.getVolume();
    if (volume) {
      if (birdMesh !== null) {
        //TODO: rotate through planegeometries based on elapsedTime, so there's no more than 6 plane geometries active at the same time. Pop them after some time!
        birdMesh.rotation.y += elapsedTimeDelta * 0.5 + volume;
        birdMesh.position.x += elapsedTimeDelta + volume;
        camera.position.x += elapsedTimeDelta + volume;
        if (
          Math.ceil(elapsedTime) % howManySecoundsToAddFlowers === 0 &&
          !calledTemp // we only get into this if block once, since we append new objects into the scene only once per the specified interval in the "howManySecoundsToAddFlowers" variable
        ) {
          calledTemp = true; // we remember, that we've been in that if, so we won't call it on the new screen refrest
          console.log("10sek");
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

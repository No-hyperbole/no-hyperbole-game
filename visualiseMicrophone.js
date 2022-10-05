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

  // plane geometry
  const geometry = new THREE.PlaneGeometry(10, 10);
  const material1 = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
  });
  const material2 = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide,
  });
  const plane1 = new THREE.Mesh(geometry, material1);
  plane1.position.z = 10;
  scene.add(plane1);
  const plane2 = new THREE.Mesh(geometry, material2);
  plane2.scale.set(2, 3, 3);
  plane2.position.x = -10;
  scene.add(plane2);

  // light
  const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  scene.add(light);

  // gameloop
  function render() {
    renderer.render(scene, camera);
  }

  const animate = () => {
    requestAnimationFrame(animate);
    const volume = microphone.getVolume();
    if (volume) {
      if (birdMesh !== null) {
        birdMesh.rotation.y += 0.01;
        birdMesh.position.x += 0.01 + volume;
        camera.position.x += 0.01 + volume;
      }
    }
    render();
  };

  animate();
}

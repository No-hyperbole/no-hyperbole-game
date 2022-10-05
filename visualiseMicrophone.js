function main() {
  // microphoneInput.js
  const microphone = new Microphone();

  // three.js
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x461661);
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
  const material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  // light
  const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  scene.add(light);

  // gameloop
  function render() {
    renderer.render(scene, camera);
    renderer.setClearColor(0xff0000, 0);
  }

  const animate = () => {
    requestAnimationFrame(animate);
    const volume = microphone.getVolume();
    if (volume) {
      if (birdMesh !== null) {
        birdMesh.rotation.y += volume;
        birdMesh.position.x += 0.01 + volume;
        camera.position.x += 0.01 + volume;
      }
    }
    render();
  };

  animate();
}

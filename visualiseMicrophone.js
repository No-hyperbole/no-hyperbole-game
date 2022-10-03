function main() {
  // microphoneInput.js
  const microphone = new Microphone();

  // three.js
  let birdMesh;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x461661);
  let camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

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
  const loader = new THREE.GLTFLoader(); //using gltf, since it has texture data hardcoded
  loader.load("./3D assets/untitled.glb", function (bird) {
    console.log(bird);
    const birdMesh = bird.scene;
    scene.add(birdMesh);
    render();
  });

  // light
  const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  scene.add(light);

  // gameloop
  function render() {
    renderer.render(scene, camera);
    renderer.setClearColor(0xff0000, 0);
  }

  function animate() {
    requestAnimationFrame(animate);
    const volume = microphone.getVolume();
    if (volume && birdMesh) {
      birdMesh.scale.set(10 + volume, 10 + volume, 10 + volume);
    }
  }

  animate();
}

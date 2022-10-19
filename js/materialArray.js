// material array
let materialArray = [];

materialArray.push(
  new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("./3D assets/textures/floral1.png"),
    transparent: true,
    opacity: 1,
    color: 0xffffff,
    side: THREE.DoubleSide,
  })
);

materialArray.push(
  new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("./3D assets/textures/animal1.png"),
    transparent: true,
    opacity: 1,
    color: 0xffffff,
    side: THREE.DoubleSide,
  })
);

materialArray.push(
  new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("./3D assets/textures/animal2.png"),
    transparent: true,
    opacity: 1,
    color: 0xffffff,
    side: THREE.DoubleSide,
  })
);

materialArray.push(
  new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("./3D assets/textures/animal3.png"),
    transparent: true,
    opacity: 1,
    color: 0xffffff,
    side: THREE.DoubleSide,
  })
);

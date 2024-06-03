import * as THREE from 'three';

export const MainLight = () => {
  const color: number = 0xffffff;
  const intensity: number = 1;
  const shadowMapSize: number = 512;
  const lightScale: number = 10;
  const shadowBias: number = -0.001;

  const newLight = new THREE.DirectionalLight(color, intensity);

  newLight.castShadow = true;
  newLight.shadow.mapSize = new THREE.Vector2(shadowMapSize, shadowMapSize);
  newLight.shadow.bias = shadowBias;
  newLight.shadow.camera.left = -lightScale;
  newLight.shadow.camera.right = lightScale;
  newLight.shadow.camera.top = -lightScale;
  newLight.shadow.camera.bottom = lightScale;

  return newLight;
};

export const AmbientLight = () => {
  const color: number = 0xffffff;
  const intensity: number = 1;
  const newLight = new THREE.AmbientLight(color, intensity);

  return newLight;
};

export const testCube = () => {
  const geometry = new THREE.BoxGeometry(5, 5, 5);
  const material = new THREE.MeshPhysicalMaterial({ color: 0x0044ff });

  const newMesh = new THREE.Mesh(geometry, material);
  newMesh.receiveShadow = true;
  newMesh.castShadow = true;
  return newMesh;
};

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

let gltfLoader: GLTFLoader;

const setupLoader = () => {
  const draco = new DRACOLoader();
  draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  return new GLTFLoader().setDRACOLoader(draco);
};

export const loadGLTF = async (url: string, scale: number = 1): Promise<THREE.Group> => {
  gltfLoader = gltfLoader ?? setupLoader();

  const model = await gltfLoader.loadAsync(url);
  model.scene.scale.set(scale, scale, scale);
  processMaterial(model.scene);

  return model.scene;
};

export const processMaterial = (model: THREE.Group) => {
  model.traverse((obj) => {
    const objAsMesh: THREE.Mesh = obj as THREE.Mesh;
    if (!objAsMesh.isMesh) return;

    objAsMesh.castShadow = true;
    objAsMesh.receiveShadow = true;

    const material = <THREE.MeshPhysicalMaterial>objAsMesh.material;

    material.side = THREE.FrontSide;

    objAsMesh.material = material;
  });
};

import * as THREE from 'three';

/**
 * 3Dオブジェクトを名前と位置、角度を一度に設定します
 *
 * @param scene -追加するシーン
 * @param object -オブジェクト
 * @param name -名前
 * @param position -位置
 * @param rotation -角度
 * @returns 生成されたオブジェクト
 */
export const newObj = (
  scene: THREE.Scene,
  object: THREE.Object3D,
  name: string = object.name,
  position: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
  rotation: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
): THREE.Object3D<THREE.Object3DEventMap> => {
  const newObj = object;
  newObj.name = name;
  newObj.position.copy(position);
  newObj.rotation.setFromVector3(rotation);
  scene.add(newObj);
  return newObj;
};

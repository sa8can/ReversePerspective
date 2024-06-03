import * as THREE from 'three';

const changeModelAnimDuration: number = 0.3;
const startAnimDuration: number = 0.6;

const posRightToCenter = {
  name: '.position[x]',
  type: 'number',
  times: [0, changeModelAnimDuration],
  values: [100, 0],
  interpolation: THREE.InterpolateSmooth,
};

const posCenterToLeft = {
  name: '.position[x]',
  type: 'number',
  times: [0, changeModelAnimDuration],
  values: [0, -100],
  interpolation: THREE.InterpolateSmooth,
};

const posLeftToCenter = {
  name: '.position[x]',
  type: 'number',
  times: [0, changeModelAnimDuration],
  values: [-100, 0],
  interpolation: THREE.InterpolateSmooth,
};

const posCenterToRight = {
  name: '.position[x]',
  type: 'number',
  times: [0, changeModelAnimDuration],
  values: [0, 100],
  interpolation: THREE.InterpolateSmooth,
};

const sizeStart = {
  name: '.scale',
  type: 'vector',
  times: [0, startAnimDuration],
  values: [0, 0, 0, 1, 1, 1],
  interpolation: THREE.InterpolateSmooth,
};

const startClip: THREE.AnimationClip = THREE.AnimationClip.parse({
  duration: startAnimDuration,
  tracks: [sizeStart],
});

const centerToLeftClip: THREE.AnimationClip = THREE.AnimationClip.parse({
  duration: changeModelAnimDuration,
  tracks: [posCenterToLeft],
});

const rightToCenterClip: THREE.AnimationClip = THREE.AnimationClip.parse({
  duration: changeModelAnimDuration,
  tracks: [posRightToCenter],
});

const leftToCenterClip: THREE.AnimationClip = THREE.AnimationClip.parse({
  duration: changeModelAnimDuration,
  tracks: [posLeftToCenter],
});

const centerToRightClip: THREE.AnimationClip = THREE.AnimationClip.parse({
  duration: changeModelAnimDuration,
  tracks: [posCenterToRight],
});

export { rightToCenterClip, centerToLeftClip, leftToCenterClip, centerToRightClip, startClip };

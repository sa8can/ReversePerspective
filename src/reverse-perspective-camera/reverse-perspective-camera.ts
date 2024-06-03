import * as THREE from 'three';

type clipPos = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export default class ReversPerspectiveCamera {
  public readonly camera: THREE.PerspectiveCamera;
  public perspective: number = 0;
  public distance: number = 0;

  constructor(
    _camera: THREE.PerspectiveCamera,
    _perspective: number,
  ) {
    this.camera = _camera;
    this.perspective = _perspective;
    this.updateCamera();
  }

  public updateCamera() {
    const clipPos = this.getCameraClipAreas() as clipPos;
    const calculatedDistance = -this.distance / -this.perspective - this.camera.position.z;
    
    //perspectiveとdistanceは双曲線の関係。
    //perspective=0では特異点となり表示が不安定になるので0に近い場合表示を更新しない。
    if (this.perspective > -0.01 && this.perspective < 0.01) return;

    this.camera.projectionMatrix = this.makeReverseFrustum(clipPos, calculatedDistance);
  }

  private getCameraClipAreas() {
    const radFov = (this.camera.fov * Math.PI) / 360;

    const aspect = this.camera.aspect;
    const left = -this.camera.near * Math.tan(radFov) * aspect;
    const right = this.camera.near * Math.tan(radFov) * aspect;
    const top = this.camera.near * Math.tan(radFov);
    const bottom = -this.camera.near * Math.tan(radFov);

    const clipBoundaries : clipPos = { left: left, right: right, top: top, bottom: bottom };
    return clipBoundaries ;
  }

  //prettier-ignore
  private makeReverseFrustum(clipPos:clipPos,actualDistance:number) {
    const matrix = new THREE.Matrix4();

    const n1 = [];
    const n2 = [];
    const n3 = [];
    const n4 = [];

    const dist = actualDistance;
    const width = ( clipPos.right - clipPos.left );
    const height = ( clipPos.top - clipPos.bottom );
    const eps = 0.1;

    const m11 = 1 / height;
    const m22 = 1 / width;
    const m33 = - eps;
    const m34 = -this.perspective;
    const m43 = -this.perspective;
    const m44 = 1 - dist * -this.perspective;

    n1[0] = m11;  n1[1] = 0;    n1[2] = 0;    n1[3] = 0;
    n2[0] = 0;    n2[1] = m22;  n2[2] = 0;    n2[3] = 0;
    n3[0] = 0;    n3[1] = 0;    n3[2] = m33;  n3[3] = m34;
    n4[0] = 0;    n4[1] = 0;    n4[2] = m43;  n4[3] = m44;

    matrix.set(n1[0],n1[1],n1[2],n1[3],
               n2[0],n2[1],n2[2],n2[3],
               n3[0],n3[1],n3[2],n3[3],
               n4[0],n4[1],n4[2],n4[3]
              ); 

    return matrix;
  }
}

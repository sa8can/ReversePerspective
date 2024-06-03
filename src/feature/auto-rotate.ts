import * as THREE from 'three';
import Updatable from '../updatable/updatable';
import { Pointer } from '../user-input/pointer-manager';

export default class AutoRotate extends Updatable {
  private readonly target: THREE.Object3D;
  private readonly ROTATION_AXIS: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
  private readonly DEG2RAD = Math.PI / 180;

  private rotMultiply: number = 1;
  private readonly ROTATION_SPEED: number = -0.05;

  constructor(_target: THREE.Object3D) {
    super();
    this.target = _target;
  }

  public update(deltaTime: number) {
    const rotateSpeedRad = this.ROTATION_SPEED * this.DEG2RAD;

    this.updateRotMultiply(deltaTime);
    this.target.rotateOnWorldAxis(
      this.ROTATION_AXIS,
      rotateSpeedRad * this.rotMultiply * deltaTime,
    );
  }

  private updateRotMultiply(deltaTime: number) {
    const isClickCanvas = Pointer.primaryPointerEvent?.target instanceof HTMLCanvasElement;

    if (Pointer.isPointerDown && isClickCanvas) {
      this.rotMultiply = 0;
      return;
    }

    const deltaSecTime = deltaTime / 1000;
    this.rotMultiply += deltaSecTime;
    this.rotMultiply = this.clamp(this.rotMultiply, 0, 1);
  }

  private clamp(value: number, min: number, max: number): number {
   return Math.max(min, Math.min(max, value));
  }
}

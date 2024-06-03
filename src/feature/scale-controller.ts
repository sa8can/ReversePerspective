import * as THREE from 'three';
import { Pointer } from '../user-input/pointer-manager';

export default class ScaleController {
  public readonly target: THREE.Object3D;

  private objectScale: number = 1;

  private readonly MAX_SCALE: number = 2;
  private readonly MIN_SCALE: number = 0.3;
  private readonly ZOOM_RATIO: number = 0.003;

  public get scale(): number {
    return this.objectScale;
  }

  constructor(_target: THREE.Object3D) {
    this.target = _target;

    Pointer.addPinchEvent((distance) => this.onPinch(distance));
    document.addEventListener('wheel', (event) => this.onMoveWheel(event));
  }

  private onPinch(distance: number) {
    this.objectScale += distance * this.ZOOM_RATIO;
    this.updateScale();
  }

  private onMoveWheel(event: WheelEvent) {
    this.objectScale += event.deltaY / 1000;
    this.updateScale();
  }

  private updateScale() {
    this.objectScale = this.clamp(this.objectScale, this.MIN_SCALE, this.MAX_SCALE);
    this.target.scale.set(this.objectScale, this.objectScale, this.objectScale);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}

import * as THREE from 'three';
import Updatable from '../updatable/updatable';
import { Pointer } from '../user-input/pointer-manager';

export default class RotationController extends Updatable {
  public readonly target: THREE.Object3D;

  private readonly WORLD_AXIS_X = new THREE.Vector3(1, 0, 0);
  private readonly WORLD_AXIS_Y = new THREE.Vector3(0, 1, 0);
  private readonly ROT_INTENSITY: number = 0.008;
  private readonly ROT_DAMPING: number = 0.005;

  private dragOrigin: THREE.Vector2 = new THREE.Vector2();
  private dragDiff: THREE.Vector2 = new THREE.Vector2();

  private deltaRotX: number = 0;
  private deltaRotY: number = 0;
  private prevRotX: number = 0;
  private prevRotY: number = 0;

  private rotCacheLength: number = 5;
  private readonly rotCacheX: number[] = [0];
  private readonly rotCacheY: number[] = [0];

  constructor(_target: THREE.Object3D) {
    super();
    this.target = _target;
    this.addPointerEvent();
  }

  private addPointerEvent() {
    Pointer.addPointerEvent('down', (event) => this.onPointerDown(event));
    Pointer.addPointerEvent('move', (event) => this.onPointerMove(event));
    Pointer.addPointerEvent('up', () => this.onPointerUp());
  }

  private isValidPointerDown(event: PointerEvent): boolean {
    if (event === undefined) return false;
    return event.target instanceof HTMLCanvasElement;
  }

  private onPointerDown(event: PointerEvent) {
    if (!this.isValidPointerDown(event)) return;
    if (Pointer.pointerCount >= 2) return;

    this.startDrag();
  }

  private onPointerMove(event: PointerEvent) {
    if (Pointer.pointerCount >= 2) return;

    const currPointerPos = new THREE.Vector2(event.screenX, event.screenY);
    this.dragDiff = currPointerPos.sub(this.dragOrigin);
  }

  private onPointerUp() {
    if (Pointer.pointerCount >= 2) return;

    //複数あったポインターが離されて1つになったとき、急に角度が変わらないようドラッグ原点を再設定
    if (Pointer.pointerCount === 1) this.startDrag();

    this.setInertia();
    this.rotCacheX.fill(0);
    this.rotCacheY.fill(0);
  }

  private startDrag() {
    const event = Pointer.primaryPointerEvent;
    if (event === undefined) return;

    this.dragOrigin.set(event.screenX, event.screenY);
    this.dragDiff = new THREE.Vector2(0, 0);
    this.prevRotX = this.dragDiff.y * this.ROT_INTENSITY;
    this.prevRotY = this.dragDiff.x * this.ROT_INTENSITY;
  }

  public update(deltaTime: number) {
    const currentRotX = this.dragDiff.y * this.ROT_INTENSITY;
    const currentRotY = this.dragDiff.x * this.ROT_INTENSITY;

    if (Pointer.isPointerDown && this.isValidPointerDown(Pointer.primaryPointerEvent)) {
      this.updateDragRotate(currentRotX, currentRotY);
      this.cacheDeltaRot();
    } else {
      this.updateInertia(deltaTime);
    }

    this.target.rotateOnWorldAxis(this.WORLD_AXIS_X, this.deltaRotX);
    this.target.rotateOnWorldAxis(this.WORLD_AXIS_Y, this.deltaRotY);

    this.prevRotX = currentRotX;
    this.prevRotY = currentRotY;
  }

  private updateDragRotate(currentRotX: number, currentRotY: number) {
    this.deltaRotX = currentRotX - this.prevRotX;
    this.deltaRotY = currentRotY - this.prevRotY;
  }

  private updateInertia(deltaTime: number) {
    this.deltaRotX /= 1 + this.ROT_DAMPING * deltaTime;
    this.deltaRotY /= 1 + this.ROT_DAMPING * deltaTime;
  }

  private setInertia() {
    //rotCacheの平均値が慣性の初期速度
    const rotCacheXAve = this.rotCacheX.reduce((prev, curr) => prev + curr) / this.rotCacheX.length;
    const rotCacheYAve = this.rotCacheY.reduce((prev, curr) => prev + curr) / this.rotCacheY.length;
    this.deltaRotX = rotCacheXAve;
    this.deltaRotY = rotCacheYAve;
  }

  //ポインターを離したフレームでdeltaRotが0だった場合、引っ掛かったように慣性が0になってしまう。
  //対策として、数フレーム前までのdeltaRotを配列にキャッシュしておき、その平均値を慣性の初期速度にする。
  private cacheDeltaRot() {
    this.rotCacheX.push(this.deltaRotX);
    this.rotCacheY.push(this.deltaRotY);
    if (this.rotCacheX.length > this.rotCacheLength) this.rotCacheX.shift();
    if (this.rotCacheY.length > this.rotCacheLength) this.rotCacheY.shift();
  }
}

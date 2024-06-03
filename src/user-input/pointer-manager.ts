export type PointerEventCallback = (event: PointerEvent) => void;
export type PinchEventCallback = (distance: number) => void;
type pointerEventType = 'move' | 'down' | 'up';

/**
 * ポインターイベントを管理します。
 * ピンチ操作にも対応しています。
 * 最初にinit()を呼び出してください。
 */
class PointerManager {
  private static initialized: boolean = false;

  private static readonly MAX_POINTER_COUNT: number = 2;
  private static readonly pointerCache: PointerEvent[] = [];

  private static readonly onPointerDownEvents: PointerEventCallback[] = [];
  private static readonly onPointerUpEvents: PointerEventCallback[] = [];
  private static readonly onPointerMoveEvents: PointerEventCallback[] = [];
  private static readonly onPointerPinchEvents: PinchEventCallback[] = [];

  private static prevPinchDistance: number = -1; //ピンチ開始時は-1

  public static get isPointerDown(): boolean {
    return this.pointerCache.length > 0;
  }

  public static get pointerCount(): number {
    return this.pointerCache.length;
  }

  public static get primaryPointerEvent(): PointerEvent {
    return this.pointerCache[0];
  }

  public static init() {
    if (this.initialized) return;
    this.initialized = true;

    document.addEventListener('pointermove', (event) => this.onPointerMove(event));
    document.addEventListener('pointerdown', (event) => this.onPointerDown(event));
    document.addEventListener('pointercancel', () => this.reset());
    document.addEventListener('pointerup', (event) => this.onPointerUp(event));
  }

  private static onPointerMove(event: PointerEvent) {
    if (!this.isPointerDown) return;

    this.updatePointerCache(event);

    if (this.pointerCount === 2) this.onPinch();
    this.onPointerMoveEvents.forEach((callBack) => callBack(event));
  }

  private static onPointerDown(event: PointerEvent) {
    if (this.pointerCount < this.MAX_POINTER_COUNT) this.pointerCache.push(event);

    this.onPointerDownEvents.forEach((callBack) => callBack(event));
  }

  private static onPointerUp(event: PointerEvent) {
    const pointerUpIndex = this.pointerCache.findIndex(
      (cache) => cache.pointerId === event.pointerId,
    );
    if (pointerUpIndex === -1) return;

    this.pointerCache.splice(pointerUpIndex, 1);

    if (this.pointerCount < 2) this.prevPinchDistance = -1;
    this.onPointerUpEvents.forEach((callBack) => callBack(event));
  }

  private static updatePointerCache(event: PointerEvent) {
    const index = this.pointerCache.findIndex((cache) => event.pointerId === cache.pointerId);
    if (index !== -1) this.pointerCache[index] = event;
  }

  private static onPinch() {
    const currPinchDistance = Math.sqrt(
      (this.pointerCache[0].screenX - this.pointerCache[1].screenX) ** 2 +
        (this.pointerCache[0].screenY - this.pointerCache[1].screenY) ** 2,
    );

    if (this.prevPinchDistance < 0) {
      this.prevPinchDistance = currPinchDistance;
    }

    const pinchDistance = currPinchDistance - this.prevPinchDistance;
    this.onPointerPinchEvents.forEach((callBack) => callBack(pinchDistance));
    this.prevPinchDistance = currPinchDistance;
  }

  private static reset() {
    this.pointerCache.length = 0;
    this.prevPinchDistance = -1;
  }

  public static addPointerEvent(type: pointerEventType, callback: PointerEventCallback) {
    switch (type) {
      case 'move':
        this.onPointerMoveEvents.push(callback);
        break;

      case 'down':
        this.onPointerDownEvents.push(callback);
        break;

      case 'up':
        this.onPointerUpEvents.push(callback);
        break;

      default:
        break;
    }

    return callback;
  }

  public static addPinchEvent(event: PinchEventCallback) {
    this.onPointerPinchEvents.push(event);
    return event;
  }

  public static removePointerEvent(type: pointerEventType, deleteEvent: PointerEventCallback) {
    let removeIndex: number = 0;

    switch (type) {
      case 'move':
        removeIndex = this.onPointerMoveEvents.findIndex((event) => event === deleteEvent);
        this.onPointerMoveEvents.splice(removeIndex, 1);
        break;

      case 'down':
        removeIndex = this.onPointerDownEvents.findIndex((event) => event === deleteEvent);
        this.onPointerMoveEvents.splice(removeIndex, 1);
        break;

      case 'up':
        removeIndex = this.onPointerUpEvents.findIndex((event) => event === deleteEvent);
        this.onPointerMoveEvents.splice(removeIndex, 1);
        break;

      default:
        break;
    }
  }

  public static removePinchEvent(deleteEvent: PinchEventCallback) {
    const removeIndex = this.onPointerPinchEvents.findIndex((event) => event === deleteEvent);
    this.onPointerPinchEvents.splice(removeIndex, 1);
  }
}

export { PointerManager as Pointer };

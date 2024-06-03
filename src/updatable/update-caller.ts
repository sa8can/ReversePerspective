import Updatable from './updatable';

/**
 * 毎フレームupdate関数を呼び出すクラス
 */
export default class UpdateCaller {
  private static callList: Array<Updatable> = [];
  private static lastCall?: Updatable | undefined;
  public static beforeUpdate?: CallableFunction[] = [];
  public static afterUpdate?: CallableFunction[] = [];

  private static _isStartUpdate = false;

  public static get isStartUpdate(): boolean {
    return this._isStartUpdate;
  }

  public static startUpdate() {
    if (this.isStartUpdate) return;

    this._isStartUpdate = true;
    requestAnimationFrame(() => this.callUpdate(performance.now()));
  }

  private static callUpdate(lastTime: number) {
    this.beforeUpdate?.forEach((callback) => callback());
    this.callList.forEach((ele) => ele.update(performance.now() - lastTime));
    this.lastCall?.update(performance.now() - lastTime);
    this.afterUpdate?.forEach((callback) => callback());

    const now = performance.now();
    requestAnimationFrame(() => this.callUpdate(now));
  }

  public static add(target: Updatable) {
    this.callList.push(target);
  }

  public static setLastCall(target: Updatable) {
    this.lastCall = target;
  }

  public static remove(target: Updatable) {
    this.callList = this.callList.filter((element) => element !== target);
  }

  public static removeBeforeUpdate(target: CallableFunction) {
    this.beforeUpdate = this.beforeUpdate?.filter((element) => element !== target);
  }

  public static removeAfterUpdate(target: CallableFunction) {
    this.afterUpdate = this.afterUpdate?.filter((element) => element !== target);
  }
}

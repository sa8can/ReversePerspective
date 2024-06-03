export type KeyEventCallback = (event: KeyboardEvent) => void;
export type KeyEvent = { keys: string[]; callback: KeyEventCallback };

/**
 * キー入力イベントを管理します。
 * このクラス外でaddEventListenerを使いキー入力を取得しないこと
 * 最初にinit()を呼び出してください
 */
class InputKeyManager {
  private static initialized: boolean = false;
  private static pressKeys: string[] = [];
  private static _keyDownEvents: KeyEvent[] = [];
  private static _keyUpEvents: KeyEvent[] = [];

  public static get keyDownEvents(): KeyEvent[] {
    return this._keyDownEvents;
  }

  public static get keyUpEvents(): KeyEvent[] {
    return this._keyUpEvents;
  }

  public static init() {
    if (this.initialized) return;
    this.initialized = true;

    document.addEventListener('keydown', (event) => {
      this.addPressKey(event);
      this.onKeyDown(event);
    });

    document.addEventListener('keyup', (event) => {
      this.removePressKey(event);
      this.onKeyUp(event);
    });

    document.addEventListener('visibilitychange', () => {
      this.pressKeys = [];
    });
  }

  private static addPressKey(event: KeyboardEvent) {
  if (!event.key.match(/^\w$/) && !event.key.match(/[Shift|Arrow.+]/)) return;

    if (!this.pressKeys.includes(event.key)) {
      this.pressKeys.push(event.key);
    }

    this.cleanPressKeys();
  }

  private static removePressKey(event: KeyboardEvent) {
    this.pressKeys = this.pressKeys.filter((pressKey) => pressKey !== event.key);
    this.cleanPressKeys();
  }

  private static cleanPressKeys() {
    this.pressKeys = this.pressKeys.filter((pressKey) => pressKey !== 'Dead');
  }

  private static onKeyDown(event: KeyboardEvent) {
    this._keyDownEvents.forEach((keyDownEvent) => {
      let keyCount: number = 0;
      
      keyDownEvent.keys.forEach((key) => {
        if (this.pressKeys.includes(key)) keyCount++;
      });

      const allKeysMatch = keyCount === keyDownEvent.keys.length;
      const pressKeyCountMatch = this.pressKeys.length === keyDownEvent.keys.length;

      if (allKeysMatch && pressKeyCountMatch) keyDownEvent.callback(event);
    });
  }

  private static onKeyUp(event: KeyboardEvent) {
    //大文字のpressKeysを消すため
    if (event.key === 'Shift') this.pressKeys = [];

    this._keyUpEvents.forEach((keyUpEvent) => {
      if (event.key === keyUpEvent.keys[0]) keyUpEvent.callback(event);
    });
  }

  public static addKeyDownEvent(_keys: string | string[], callback: KeyEventCallback) {
    if (!this.initialized) this.init();

    const keys = typeof _keys === 'string' ? [_keys] : _keys;
    const newKeyEvent: KeyEvent = { keys: keys, callback: callback };

    this._keyDownEvents.push(newKeyEvent);

    return newKeyEvent;
  }

  public static addKeyUpEvent(key: string, callback: KeyEventCallback) {
    if (!this.initialized) this.init();

    const newKeyEvent: KeyEvent = { keys: [key], callback: callback };

    this._keyUpEvents.push(newKeyEvent);

    return newKeyEvent;
  }

  public static removeKeyDownEvent(keyEvent: KeyEvent) {
    if (!this.initialized) this.init();

    this._keyDownEvents = this._keyDownEvents.filter((event) => event !== keyEvent);
  }

  public static removeKeyUpEvent(keyEvent: KeyEvent) {
    if (!this.initialized) this.init();

    this._keyUpEvents = this._keyUpEvents.filter((event) => event !== keyEvent);
  }
}

export { InputKeyManager as InputKey };

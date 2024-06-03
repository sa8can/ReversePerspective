import Stats from 'three/examples/jsm/libs/stats.module';
import UpdateCaller from '../updatable/update-caller';
import { InputKey } from '../user-input/input-key-manager';

export default class StatsController {
  private stats: Stats;
  private isShow: boolean = false;

  constructor() {
    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);

    UpdateCaller.beforeUpdate?.push(this.stats.begin);
    UpdateCaller.afterUpdate?.push(this.stats.end);

    InputKey.addKeyDownEvent('s', () => {
      this.isShow = !this.isShow;
      this.isShow ? this.show() : this.hide();
    });

    this.isShow ? this.show() : this.hide();
  }

  public show() {
    this.stats.dom.style.display = 'block';
  }

  public hide() {
    this.stats.dom.style.display = 'none';
  }
}

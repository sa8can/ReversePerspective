import Selector from '../data-class/html-selector-names';

export default class objectChangeButton {
  private readonly nextButton: HTMLButtonElement;
  private readonly prevButton: HTMLButtonElement;
  public enable: boolean;

  constructor(_enable: boolean = false, nextCallBack: VoidFunction, prevCallBack: VoidFunction) {
    this.enable = _enable;
    this.nextButton = <HTMLButtonElement>document.getElementById(Selector.BUTTON_NEXT);
    this.prevButton = <HTMLButtonElement>document.getElementById(Selector.BUTTON_PREV);

    this.nextButton.addEventListener('click', () => {
      if (this.enable) nextCallBack();
    });
    this.prevButton.addEventListener('click', () => {
      if (this.enable) prevCallBack();
    });
  }

  public hide() {
    this.nextButton.style.opacity = '0';
    this.prevButton.style.opacity = '0';
  }

  public show() {
    this.nextButton.style.opacity = '1';
    this.prevButton.style.opacity = '1';
  }
}

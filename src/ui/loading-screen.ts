import Selector from '../data-class/html-selector-names';
import ObjectController from '../feature/object-controller';
import * as THREE from 'three';

export default class LoadingScreen {
  private readonly wrapper: HTMLDivElement;
  private readonly barLine: HTMLDivElement;
  private readonly barFill: HTMLDivElement;
  private readonly logoRow1: HTMLParagraphElement;
  private readonly logoRow2: HTMLParagraphElement;
  private readonly info: HTMLParagraphElement;
  private readonly progress: HTMLParagraphElement;
  private readonly copyRights: HTMLParagraphElement;

  private errorTextColor: string = '#ff0000';
  private normalTextColor: string = getComputedStyle(document.body).getPropertyValue('--textColor');

  private readonly clock: THREE.Clock = new THREE.Clock();
  private nextCallTime: number = 0;
  private nextTimeDiff: number = 0.01;


  constructor() {
    this.wrapper = document.getElementById(Selector.LOADING_SCREEN)! as HTMLDivElement;
    this.barLine = document.getElementById(Selector.LOADING_BAR_LINE)! as HTMLDivElement;
    this.barFill = document.getElementById(Selector.LOADING_BAR_FILL)! as HTMLDivElement;
    this.logoRow1 = document.getElementById(Selector.LOADING_LOGO1)! as HTMLParagraphElement;
    this.logoRow2 = document.getElementById(Selector.LOADING_LOGO2)! as HTMLParagraphElement;
    this.info = document.getElementById(Selector.LOADING_INFO)! as HTMLParagraphElement;
    this.progress = document.getElementById(Selector.LOADING_PROGRESS)! as HTMLParagraphElement;
    this.copyRights = document.querySelector('.copy-rights')! as HTMLParagraphElement;

    this.barLine.addEventListener('animationend', () => this.onCompleteAnimation());
    this.barLine.addEventListener('animationcancel', () => this.onCompleteAnimation());

    document.body.classList.add(Selector.LOADING_CLASS);
  }

  public onUpdateLoadInfo(message: string, progress: number) {
    this.barFill.style.width = `${Math.round(progress)}%`;
    this.progress.textContent = Math.round(progress).toString();
    this.info.textContent = message;

    const isError = message.toString().match(/^Error.*/);

    if (isError) this.info.style.color = this.errorTextColor;
    else this.info.style.color = this.normalTextColor;
  }

  public onCompleteLoad(objController: ObjectController) {
    setTimeout(() => {
      objController.playAnimation('start');
      this.updateDeleteTextAnim();
    }, 500);
  }

  private updateDeleteTextAnim() {
    const time = this.clock.getElapsedTime();

    if (time > this.nextCallTime) {
      this.nextCallTime = time + this.nextTimeDiff;

      this.deleteTextWithRandomCharacterEffect(this.info.textContent!, (str: string) => {
        this.info.textContent = str;
      });

      this.deleteTextWithRandomCharacterEffect(this.logoRow1.textContent!, (str: string) => {
        this.logoRow1.textContent = str;
      });

      this.deleteTextWithRandomCharacterEffect(this.logoRow2.textContent!, (str: string) => {
        this.logoRow2.textContent = str;
      });

      this.deleteTextWithRandomCharacterEffect(this.progress.textContent!, (str: string) => {
        this.progress.textContent = str;
      });

      this.deleteTextWithRandomCharacterEffect(this.copyRights.textContent!, (str: string) => {
        this.copyRights.textContent = str;
      });

      if (this.info.textContent!.length < 10) {
        this.wrapper.classList.add('deleted-text');
      }
    }

    requestAnimationFrame(() => this.updateDeleteTextAnim());
  }

  private onCompleteAnimation() {
    document.body.classList.remove(Selector.LOADING_CLASS);
    document.body.classList.add(Selector.LOADING_COMPLETE_CLASS);
  }

  private deleteTextWithRandomCharacterEffect(str: string, callback: CallableFunction): boolean {
    if (str.length > 1) {
      str = str.substring(0, str.length - 1);
      str = str.substring(0, str.length - 1) + Math.random().toString(36).at(-1);
    } else str = '';

    callback(str);

    return str.length === 0;
  }
}

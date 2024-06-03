import Selector from '../data-class/html-selector-names';
import { getUseAgent } from '../utility/get-user-agent';
import { InputKey } from '../user-input/input-key-manager';

type onInput = (value: number) => void;

export default class PersPectiveSlider {
  public readonly Slider: HTMLInputElement;
  public readonly SliderNumber: HTMLParagraphElement;
  public readonly Range: { min: number; max: number };
  private readonly onInputCallback: onInput;
  public apparentValueMax: number = 120; // SliderNumberに表示される数値の絶対値の最大値

  private baseColor = getComputedStyle(document.body).getPropertyValue('--textColor');
  private negativeColor = getComputedStyle(document.body).getPropertyValue('--accentColor');
  private positiveColor = getComputedStyle(document.body).getPropertyValue('--accentColor');

  private userAgent: string = getUseAgent();

  constructor(_range: { min: number; max: number }, _onInputCallback: onInput) {
    this.Range = _range;
    this.onInputCallback = _onInputCallback;

    this.Slider = document.getElementById(Selector.SLIDER)! as HTMLInputElement;
    this.SliderNumber = document.getElementById(Selector.SLIDER_NUMBER)! as HTMLParagraphElement;

    this.Slider.addEventListener('input', () => this.onInput());

    this.setSliderAttr();
    this.addKeyEvent();
    this.onInput();
  }

  private setSliderAttr() {
    this.Slider.min = '-1';
    this.Slider.max = '1';
    this.Slider.step = '0.01';
    this.Slider.value = this.Slider.max;
  }

  private addKeyEvent() {
    InputKey.addKeyDownEvent('ArrowUp', () => {
      this.Slider.value = (Number.parseFloat(this.Slider.value) + 0.05).toString();
      this.onInput();
    });
    InputKey.addKeyDownEvent('ArrowDown', () => {
      this.Slider.value = (Number.parseFloat(this.Slider.value) - 0.05).toString();
      this.onInput();
    });
  }

  public onInput() {
    const sliderValue = Number.parseFloat(this.Slider.value);
    const value = this.calcValue(sliderValue);

    this.SliderNumber.textContent = Math.floor(sliderValue * this.apparentValueMax).toString();
    this.onInputCallback(value);
    this.updateSliderStyle();
  }

  private calcValue(sliderValue: number): number {
    return sliderValue >= 0 ? this.Range.max * sliderValue : this.Range.min * -sliderValue;
  }

  private updateSliderStyle() {
    const min = Number.parseFloat(this.Slider.min);
    const max = Number.parseFloat(this.Slider.max);
    const value = Number.parseFloat(this.Slider.value);

    const progress = ((value - min) / (max - min)) * 100;
    let gradientText: string = '';

    if (progress > 50) {
      //prettier-ignore
      gradientText = `linear-gradient(90deg, ${this.baseColor} ${ 50 }%, ${this.positiveColor} ${ 50 }%, ${this.positiveColor} ${progress}%, ${this.baseColor} ${progress}%)`;
    } else {
      //prettier-ignore
      gradientText = `linear-gradient(90deg, ${this.baseColor} ${progress}%,${this.negativeColor} ${progress}%,${this.negativeColor} ${ 50 }%,${this.baseColor} ${ 50 }%)`;
    }

    //firefoxではsliderのtrackにbackgroundを設定しないと正しく表示されないようなので分岐
    if (this.userAgent === 'firefox') {
      const sheets = document.styleSheets;
      const sheet = sheets[sheets.length - 1];
      sheet.insertRule(
        `input[type="range"]::-moz-range-track {background: ${gradientText};}`,
        sheet.cssRules.length,
      );
    } else {
      this.Slider.style.background = gradientText;
    }
  }
}

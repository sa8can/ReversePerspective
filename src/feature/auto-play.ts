import PersPectiveSlider from '../ui/perspective-slider';
import Updatable from '../updatable/updatable';
import ObjectController from './object-controller';
import { InputKey } from '../user-input/input-key-manager';

/**
 * 展示用オートプレイ
 */
export class AutoPlay extends Updatable {
  private readonly slider: PersPectiveSlider;
  private readonly objController: ObjectController;
  private isPlay: boolean = false;

  private SLIDER_MOVE_TIME = 0.7;
  private SLIDER_STOP_TIME_MS = 4000;

  private isCompleteSliderDown: boolean = false;
  private isCompleteSliderUp: boolean = false;
  private isStopSlider: boolean = false;

  constructor(_slider: PersPectiveSlider, _objController: ObjectController) {
    super();
    this.slider = _slider;
    this.objController = _objController;

    InputKey.addKeyDownEvent('p', () => {
      this.isPlay = !this.isPlay;
      this.isStopSlider = false;
      this.reset();
    });
  }

  public update(deltaTime: number) {
    if (!this.isPlay) return;

    const deltaSecTime = deltaTime / 1000;

    if (!(this.isCompleteSliderDown && this.isCompleteSliderUp)) {
      this.moveSlider(deltaSecTime);
      return;
    }

    this.moveNext();
  }

  private moveSlider(deltaSecTime: number) {
    let perspective = Number.parseFloat(this.slider.Slider.value);

    if (!this.isStopSlider) {
      if (!this.isCompleteSliderDown) {
        perspective -= this.SLIDER_MOVE_TIME * deltaSecTime;
        if (
          this.slider.SliderNumber.textContent ===
          '-' + this.slider.apparentValueMax.toString()
        ) {
          this.isCompleteSliderDown = true;
          this.isStopSlider = true;

          setTimeout(() => {
            this.isStopSlider = false;
          }, this.SLIDER_STOP_TIME_MS);
        }
      }

      if (this.isCompleteSliderDown && !this.isCompleteSliderUp) {
        perspective += this.SLIDER_MOVE_TIME * deltaSecTime;

        if (this.slider.SliderNumber.textContent === this.slider.apparentValueMax.toString()) {
          this.isStopSlider = true;

          setTimeout(() => {
            this.isCompleteSliderUp = true;
            this.isStopSlider = false;
          }, this.SLIDER_STOP_TIME_MS / 3);
        }
      }
    }

    this.slider.Slider.value = perspective.toString();
    this.slider.onInput();
  }

  private moveNext() {
    this.objController.moveNext();
    this.reset();
    this.isStopSlider = true;
    setTimeout(() => (this.isStopSlider = false), this.SLIDER_STOP_TIME_MS / 2);
  }

  private reset() {
    this.isCompleteSliderUp = false;
    this.isCompleteSliderDown = false;
  }
}

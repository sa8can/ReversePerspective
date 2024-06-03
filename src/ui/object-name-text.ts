import ModelData from '../../json/model-list.json';
import Selector from '../data-class/html-selector-names';

export default class nameUIController {
  private readonly infoContainer: HTMLDivElement;
  private readonly nameElement: HTMLHeadingElement;
  private readonly numberElement: HTMLHeadingElement;
  private readonly modelList;

  constructor(_modelList: typeof ModelData.modelList) {
    this.infoContainer = document.getElementById(Selector.INFO_CONTAINER)! as HTMLDivElement;
    this.nameElement = document.getElementById(Selector.OBJECT_NAME)! as HTMLHeadingElement;
    this.numberElement = document.getElementById(Selector.OBJECT_NUMBER)! as HTMLHeadingElement;
    this.modelList = _modelList;

    this.onChange(0, true);
  }

  public moveNext(num: number) {
    this.onChange(num, true);
  }

  public movePrev(num: number) {
    this.onChange(num, false);
  }

  private onChange(num: number, isNext: boolean) {
    this.setClasses(isNext);
    const zeroPaddingNum = (num + 1).toString().padStart(2, '0');

    this.nameElement.textContent = this.modelList[num].name;
    this.numberElement.textContent = `#${zeroPaddingNum}`;
  }

  private setClasses(isNext: boolean) {
    this.infoContainer.classList.remove('change');
    this.infoContainer.classList.remove('next');
    this.infoContainer.classList.remove('prev');

    requestAnimationFrame(() => {
      this.infoContainer.classList.add('change');
      if (isNext) this.infoContainer.classList.add('next');
      else this.infoContainer.classList.add('prev');
    });
  }
}

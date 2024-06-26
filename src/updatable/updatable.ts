import UpdateCaller from './update-caller';

export default abstract class Updatable {
  private extendsClassName: string = this.constructor.name;
  private isThrewError: boolean = false;

  constructor() {
    UpdateCaller.add(this);
    if (!UpdateCaller.isStartUpdate) UpdateCaller.startUpdate();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(deltaTime?: number) {
    if (this.isThrewError) return;

    const errorMessage: string = `${this.extendsClassName} is extends Updatable. but it is no exist 'update' method.`;
    this.isThrewError = true;

    throw Error(errorMessage);
  }
}

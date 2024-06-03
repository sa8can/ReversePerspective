import * as THREE from 'three';
import ModelData from '../../json/model-list.json';
import animController, { ObjAndClip } from './animation-controller';
import objectNameText from '../ui/object-name-text';
import objectChangeButton from '../ui/object-change-button';
import * as animations from '../data-class/animations';
import { OBJECT_SCALE } from './object-loader';
import { InputKey } from '../user-input/input-key-manager';

export default class ObjectController {
  private readonly scene: THREE.Scene;
  private readonly animController: animController;

  private canChange: boolean = false;

  private nameTextUI!: objectNameText;
  private changeButton!: objectChangeButton;

  private readonly models: Array<THREE.Object3D>;
  private readonly rotateParent: THREE.Object3D;
  private obj1Parent: THREE.Object3D;
  private obj2Parent: THREE.Object3D;
  private currModel: THREE.Object3D | undefined;
  private prevModel: THREE.Object3D | undefined;

  private currModelId: number = 0;

  private modelList: typeof ModelData.modelList;

  private _index: number = 0;
  private set index(value: number) {
    if (value < 0) value = this.models.length - 1;
    if (value > this.models.length - 1) value = 0;

    this._index = value;
  }
  public get index() {
    return this._index;
  }

  constructor(
    _scene: THREE.Scene,
    _animController: animController,
    _models: Array<THREE.Object3D>,
    _modelList: typeof ModelData.modelList,
  ) {
    this.scene = _scene;
    this.models = _models;
    this.modelList = _modelList;
    this.animController = _animController;

    this.obj1Parent = this.scene.getObjectByName('obj1Parent') as THREE.Object3D;
    this.obj2Parent = this.scene.getObjectByName('obj2Parent') as THREE.Object3D;
    this.rotateParent = this.scene.getObjectByName('objRotateParent') as THREE.Object3D;

    InputKey.addKeyDownEvent('ArrowLeft', () => this.movePrev());
    InputKey.addKeyDownEvent('ArrowRight', () => this.moveNext());

    this.setupUI();
    this.setAnimationSets();

    this.changeModel(0);
  }

  private setupUI() {
    this.nameTextUI = new objectNameText(this.modelList);
    this.changeButton = new objectChangeButton(
      false,
      () => this.moveNext(),
      () => this.movePrev(),
    );

    if (this.modelList.length <= 1) this.changeButton.hide();
  }

  private setAnimationSets() {
    const rotParentStart: ObjAndClip = { object: this.rotateParent, clip: animations.startClip };

    const obj1Next: ObjAndClip = { object: this.obj1Parent, clip: animations.rightToCenterClip };
    const obj2Next: ObjAndClip = { object: this.obj2Parent, clip: animations.centerToLeftClip };

    const obj1Prev: ObjAndClip = { object: this.obj1Parent, clip: animations.leftToCenterClip };
    const obj2Prev: ObjAndClip = { object: this.obj2Parent, clip: animations.centerToRightClip };

    this.animController.crateAnimationSet('start', [rotParentStart]);
    this.animController.crateAnimationSet('next', [obj1Next, obj2Next]);
    this.animController.crateAnimationSet('prev', [obj1Prev, obj2Prev]);
  }

  public moveNext() {
    if (!this.canChange) return;
    if (this.modelList.length <= 1) return;

    this.index++;

    this.nameTextUI.moveNext(this.index);
    this.changeModel(this.index);
    this.playAnimation('next');
  }

  public movePrev() {
    if (!this.canChange) return;
    if (this.modelList.length <= 1) return;

    this.index--;

    this.nameTextUI.movePrev(this.index);
    this.changeModel(this.index);
    this.playAnimation('prev');
  }

  private changeModel(index: number) {
    this.canChange = false;
    this.changeButton.enable = false;

    this.prevModel = this.scene.getObjectById(this.currModelId);
    if (this.prevModel && this.rotateParent) {
      this.prevModel.parent = null;

      this.prevModel.scale.set(
        this.rotateParent.scale.x * OBJECT_SCALE,
        this.rotateParent.scale.y * OBJECT_SCALE,
        this.rotateParent.scale.z * OBJECT_SCALE,
      );

      this.prevModel.setRotationFromEuler(this.rotateParent.rotation);
      this.prevModel.parent = this.obj2Parent;
    }

    this.scene.add(this.models[index]);

    this.currModel = this.models[index];
    this.currModel.rotation.set(0, 0, 0);
    this.currModel.scale.set(OBJECT_SCALE, OBJECT_SCALE, OBJECT_SCALE);
    this.currModel!.parent = this.rotateParent;
    this.currModelId = this.currModel.id;
  }

  public playAnimation(animationName: string) {
    this.animController.animationPlay(animationName, () => this.onFinishAnimation());
  }

  private onFinishAnimation() {
    this.canChange = true;
    this.changeButton.enable = true;
    this.scene.remove(this.prevModel as THREE.Object3D);
  }
}

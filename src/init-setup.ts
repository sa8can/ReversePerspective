import * as THREE from 'three';
import AutoRotate from './feature/auto-rotate';
import SceneBuilder from './data-class/scene-builder';
import ModelData from '../json/model-list.json';
import LoadingScreen from './ui/loading-screen';
import ObjController from './feature/object-controller';
import UpdateCaller from './updatable/update-caller';
import RotateController from './feature/rotation-controller';
import ScaleController from './feature/scale-controller';
import PerspectiveSlider from './ui/perspective-slider';
import AnimationController from './feature/animation-controller';
import RPCamera from './reverse-perspective-camera/reverse-perspective-camera';
import RPCameraDistController from './reverse-perspective-camera/rp-camera-distance-adjuster';
import { InputKey } from './user-input/input-key-manager';
import { loadAllModels } from './feature/object-loader';
import { Pointer } from './user-input/pointer-manager';
import { initThreeScene } from './init-three-scene';
import StatsController from './ui/stats-controller';
import { AutoPlay } from './feature/auto-play';

export default class Setup {
  private readonly world;
  private readonly animationController: AnimationController = new AnimationController();
  private readonly loadingScreen: LoadingScreen = new LoadingScreen();
  private readonly sceneBuilder: SceneBuilder;

  private perspectiveSlider!: PerspectiveSlider;

  private rpCamera?: RPCamera;
  private readonly PERSPECTIVE_MIN: number = -180;
  private readonly PERSPECTIVE_MAX: number = 100;
  private readonly CAMERA_DISTANCE_PC: number = 2800;
  private readonly CAMERA_DISTANCE_SP: number = 1600;

  private readonly NO_MODEL_ERROR_MESSAGE =
    'Error: Please add a valid 3d model in glb format to public/models/';

  constructor() {
    this.world = initThreeScene();

    this.setReversePerspectiveCamera();

    this.sceneBuilder = new SceneBuilder(this.world.scene);
    this.sceneBuilder.initSet();

    //ModelListが空の場合、ロード画面にエラーメッセージを出して処理を終了します。
    if (ModelData.modelList.length === 0) {
      this.loadingScreen.onUpdateLoadInfo(this.NO_MODEL_ERROR_MESSAGE, 0);
      return;
    }

    loadAllModels(
      ModelData.modelList,
      (models, modelList) => this.onCompleteLoadModels(models, modelList),
      (message, progress) => this.loadingScreen.onUpdateLoadInfo(message, progress),
    );

    UpdateCaller.afterUpdate?.push(() => this.world.composer.render());

    InputKey.init();
    Pointer.init();
    new StatsController();

    window.addEventListener('resize', () => this.onWindowResize());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'hidden') {
        console.log('visible!');
        setTimeout(() => this.rpCamera?.updateCamera(), 50);
      }
    });
    document.oncontextmenu = () => false;
  }

  private setReversePerspectiveCamera() {
    //カメラのアスペクトなどを先に更新しておかないと最初のアスペクトがおかしい?
    this.onWindowResize();

    this.rpCamera = new RPCamera(this.world.camera, this.PERSPECTIVE_MAX);
    new RPCameraDistController(this.rpCamera, this.CAMERA_DISTANCE_PC, this.CAMERA_DISTANCE_SP);
    this.perspectiveSlider = new PerspectiveSlider(
      { min: this.PERSPECTIVE_MIN, max: this.PERSPECTIVE_MAX },
      (value) => {
        this.rpCamera!.perspective = value;
        this.rpCamera!.updateCamera();
      },
    );
  }

  private onCompleteLoadModels(
    models: Array<THREE.Object3D>,
    modelList: typeof ModelData.modelList,
  ) {
    //読み込めた3Dモデルがない場合、ロード画面にエラーメッセージを出して処理を終了します。
    if (models.length === 0) {
      this.loadingScreen.onUpdateLoadInfo(this.NO_MODEL_ERROR_MESSAGE, 0);
      return;
    }

    const objectParent = this.world.scene.getObjectByName('objRotateParent')!;

    const objController = new ObjController(
      this.world.scene,
      this.animationController,
      models,
      modelList,
    );

    new RotateController(objectParent);
    new ScaleController(objectParent);
    new AutoRotate(objectParent);
    new AutoPlay(this.perspectiveSlider, objController);

    this.loadingScreen.onCompleteLoad(objController);
    this.onWindowResize();
  }

  private onWindowResize() {
    this.world.camera.aspect = window.innerHeight / window.innerWidth;
    this.world.camera.updateProjectionMatrix();

    const devicePixelRatio = Math.min(2, window.devicePixelRatio);
    this.world.renderer.setSize(window.innerWidth, window.innerHeight);
    this.world.renderer.setPixelRatio(devicePixelRatio);

    this.rpCamera?.updateCamera();
  }
}

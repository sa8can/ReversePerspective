import RPCamera from './reverse-perspective-camera';
import Updatable from '../updatable/updatable';

/**
 * アスペクト比を元にReversePerspectiveCameraの距離を変更する
 */
export default class RPCameraDistanceAdjuster extends Updatable {
  private readonly targetRPCamera: RPCamera;
  private spDistance: number = 0;
  private pcDistance: number = 0;

  constructor(_targetRPCamera: RPCamera, _pcDistance: number, _spDistance: number) {
    super();

    this.targetRPCamera = _targetRPCamera;
    this.pcDistance = _pcDistance;
    this.spDistance = _spDistance;
  }

  public update() {
    const currentDistance = this.targetRPCamera.camera.aspect > 1.25 ? this.spDistance : this.pcDistance;
    this.targetRPCamera.distance = currentDistance;
  }
}

import * as THREE from 'three';
import Updatable from '../updatable/updatable';

export type ObjAndClip = { object: THREE.Object3D; clip: THREE.AnimationClip };
export type AnimationSet = {
  mixers: THREE.AnimationMixer[];
  actions: THREE.AnimationAction[];
  longestAnim: THREE.AnimationMixer;
};

/**
 * 複数のアニメーションを同時に再生するクラス
 */
export default class AnimationController extends Updatable {
  public animSets: { [key: string]: AnimationSet } = {};
  private readonly updateMixers: THREE.AnimationMixer[] = [];

  constructor() {
    super();
  }

  public crateAnimationSet(name: string, objAndClipArray: ObjAndClip[]) {
    const mixers = new Array<THREE.AnimationMixer>();
    const actions = new Array<THREE.AnimationAction>();

    objAndClipArray.forEach((objAndClip) => {
      const newMixer = new THREE.AnimationMixer(objAndClip.object);
      const newAction = newMixer.clipAction(objAndClip.clip);

      newAction.setLoop(THREE.LoopOnce, 0);

      mixers.push(newMixer);
      actions.push(newAction);
    });

    const longestAnim = actions.reduce((acc, curr) =>
      curr.getClip().duration > acc.getClip().duration ? curr : acc,
    );

    const newAnimSet: AnimationSet = {
      mixers: mixers,
      actions: actions,
      longestAnim: longestAnim.getMixer(),
    };

    this.animSets[name] = newAnimSet;
  }

  public animationPlay(name: string, onFinishAllAnim: VoidFunction) {
    const animSet = this.animSets[name];
    if (animSet === undefined) return;

    animSet.actions.forEach((action) => {
      action.reset();
      action.play();
    });

    this.addMixerFinishedEvent(animSet.mixers, animSet.longestAnim, onFinishAllAnim);
  }

  private addMixerFinishedEvent(
    mixers: THREE.AnimationMixer[],
    longestAnimMixer: THREE.AnimationMixer,
    onFinishAllAnim: VoidFunction,
  ) {
    mixers.forEach((mixer) => {
      mixer.addEventListener('finished', () => {
        const removeIndex = this.updateMixers.findIndex((updateMixer) => mixer === updateMixer);
        this.updateMixers.splice(removeIndex, 1);

        //最も長いアニメーションが終了したらアニメーションセット終了とみなす
        if (mixer === longestAnimMixer) onFinishAllAnim();
        mixer.removeEventListener('finished', () => {});
      });
      this.updateMixers.push(mixer);
    });
  }

  public update(deltaTime: number) {
    if (this.updateMixers === undefined) return;

    const deltaSecTime = deltaTime / 1000;
    this.updateMixers.forEach((mixer) => mixer.update(deltaSecTime));
  }
}

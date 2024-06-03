import * as Util from '../utility/object-util';
import * as Obj from './scene-objects';
import { Vector3, Object3D, Scene } from 'three';

export default class SceneBuilder {
  private readonly scene: Scene;

  constructor(_scene: Scene) {
    this.scene = _scene;
  }

  public initSet() {
    Util.newObj(this.scene, Obj.MainLight(), 'mainLight', new Vector3(15, 15, 30));
    Util.newObj(this.scene, Obj.AmbientLight(), 'ambientLight', new Vector3(0, -15, 0));

    const obj1Parent = Util.newObj(this.scene, new Object3D(), 'obj1Parent');
    const rotateParent = Util.newObj(this.scene, new Object3D(), 'objRotateParent',undefined,new Vector3(0.5,0,0));
    Util.newObj(this.scene, new Object3D(), 'obj2Parent');

    rotateParent.parent = obj1Parent;
  }

  public removeAll(){
    this.scene.children.forEach((child) => child.remove());
  }
}

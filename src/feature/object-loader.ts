import * as THREE from 'three';
import modelData from '../../json/model-list.json';
import * as loader from '../utility/loader-util';

type onProgress = (message: string, progress: number) => void;
type onComplete = (model: Array<THREE.Object3D>, modelList: typeof modelData.modelList) => void;

export const OBJECT_SCALE = 20;

export const loadAllModels = (
  _modelList: typeof modelData.modelList,
  onComplete: onComplete,
  onProgress: onProgress,
) => {
  const models = new Array<THREE.Object3D | undefined>(_modelList.length);
  const modelList = structuredClone(_modelList);
  let progressMessage: string = '';
  let modelsLoaded: number = 0;

  modelList.forEach((data, i) => {
    loader
      .loadGLTF(data.path, OBJECT_SCALE)
      .then((model) => {
        models[i] = model;
        progressMessage = `Load: ${modelList[i].path}`;
      })
      .catch((reason) => {
        console.warn(reason);
        progressMessage = reason;
      })
      .finally(() => {
        modelsLoaded++;
        onProgress(progressMessage, (modelsLoaded / modelList.length) * 100);
        if (modelsLoaded === modelList.length) onLoadComplete(models, modelList, onComplete);
      });
  });
};

const onLoadComplete = (
  _models: Array<THREE.Object3D | undefined>,
  _modelList: typeof modelData.modelList,
  _onComplete: onComplete,
) => {
  //読み込み失敗したモデルを除く
  const filteredModels = _models.filter((model) => model !== undefined) as THREE.Object3D[];
  const filteredList = _modelList.filter((_, i) => _models[i] !== undefined);

  _onComplete(filteredModels, filteredList);
};

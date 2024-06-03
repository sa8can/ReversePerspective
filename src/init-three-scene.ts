import * as THREE from 'three';
import * as Postprocess from 'postprocessing';
import Selector from './data-class/html-selector-names';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

export const initThreeScene = () => {
  const HDR_IMAGE_PATH = '../images/environment.hdr';
  const BG_COLOR = 0xffffff;
  const FOG_PROPS = { color: 0xeeffff, near: 0, far: 50 };

  const RENDERER_WIDTH = window.innerWidth;
  const RENDERER_HEIGHT = window.innerHeight;

  const INIT_CAMERA_PROPS = {
    fov: 60,
    aspect: RENDERER_WIDTH / RENDERER_HEIGHT,
    near: 0.01,
    far: 3000,
  };

  const BLOOM_PROPS = { luminanceThreshold: 0.9, intensity: 0.2 };
  const VIGNETTE_PROPS = { darkness: 0.4, offset: 0.3 };

  const loadHDR = async (url: string) => {
    const rgbeLoader = new RGBELoader();
    const texture = await rgbeLoader.loadAsync(url);
    return texture;
  };

  //Scene-----------------------------------------------------------------------
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(FOG_PROPS.color, FOG_PROPS.near, FOG_PROPS.far);

  loadHDR(HDR_IMAGE_PATH).then((texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.environmentIntensity = 0.6;
  });

  //Canvas----------------------------------------------------------------------
  let appCanvas = document.getElementById(Selector.CANVAS);
  if (appCanvas === null) {
    appCanvas = document.createElement('canvas');
    document.body.appendChild(appCanvas);
  }

  //Renderer--------------------------------------------------------------------
  const renderer = new THREE.WebGLRenderer({
    canvas: appCanvas,
  });
  renderer.setClearColor(new THREE.Color(BG_COLOR));
  renderer.setSize(window.innerWidth, window.innerWidth);

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;

  //Camera----------------------------------------------------------------------
  const camera = new THREE.PerspectiveCamera(
    INIT_CAMERA_PROPS.fov,
    INIT_CAMERA_PROPS.aspect,
    INIT_CAMERA_PROPS.near,
    INIT_CAMERA_PROPS.far,
  );

  //PostProcess-----------------------------------------------------------------
  const composer = new Postprocess.EffectComposer(renderer);
  const rendererPass = new Postprocess.RenderPass(scene, camera);
  const bloom = new Postprocess.BloomEffect(BLOOM_PROPS);
  const vignette = new Postprocess.VignetteEffect(VIGNETTE_PROPS);
  const smaa = new Postprocess.SMAAEffect({ preset: Postprocess.SMAAPreset.MEDIUM });

  const effectPass = new Postprocess.EffectPass(camera, bloom, vignette, smaa);

  composer.addPass(rendererPass);
  composer.addPass(effectPass);

  return { scene: scene, renderer: renderer, camera: camera, composer: composer };
};

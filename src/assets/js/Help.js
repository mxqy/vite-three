import {
  AxesHelper,
  CameraHelper,
  GridHelper,
  Object3D,
  PointLightHelper,
  SpotLightHelper,
  MathUtils,
  WebGLRenderer,
  Vector3,
  Scene,
  PerspectiveCamera
} from 'three'
import { poingLight,spotLight,spotLight2,spotLight3 } from './Light'
//@ts-ignore
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
// import { GUI } from "three/examples/jsm/libs/stats.module"
import { sky,rain, group } from './BasicObject';
import { Line } from 'three';

export const helpList = []
/**辅助线 */
const axesHelper = new AxesHelper(500)
axesHelper.position.y = -13
/**地面网格 */
const gridHelper = new GridHelper(500,20,'rgb(200,200,200)','rgb(100,100,100)')
gridHelper.position.y = -13
/**聚光灯辅助线 */
export const soptLightHelper = new SpotLightHelper(spotLight,spotLight.color)
export const soptLightHelper2 = new SpotLightHelper(spotLight2,spotLight2.color)
export const soptLightHelper3 = new SpotLightHelper(spotLight3,spotLight3.color)
/**阴影 */
export const shadowCameraHelper = new CameraHelper(spotLight.shadow.camera)
export const shadowCameraHelper2 = new CameraHelper(spotLight2.shadow.camera)
export const shadowCameraHelper3 = new CameraHelper(spotLight3.shadow.camera)
export var rainNumber = 0
var play = false
var volume = 50
// const pointLightHelper = new PointLightHelper(poingLight,poingLight.distance,poingLight.color)
helpList.push(gridHelper,soptLightHelper,shadowCameraHelper,soptLightHelper2,shadowCameraHelper2,soptLightHelper3,shadowCameraHelper3)

export class guiHelper{
  constructor(renderer,sun,scene,camera,setVolume, audioPlay){
  this.gui = new GUI();
  this._renderer = renderer
  this._scene = scene
  this._camera = camera
  const rainnum = {
    '雨滴数量':rainNumber,
  }
  const action = {
    'PLAY':play,
    '音量':volume
  }
  this.gui.add(action,'PLAY').onChange((val)=>{
    audioPlay(val)
  })
  this.gui.add(action,'音量',0,100).onChange((val)=>{
    setVolume(Math.floor(val)/100)
  })
  this.gui.add(rainnum,'雨滴数量',0,5000).onChange( (val) =>{
    this._scene.remove(group);
    rainNumber = Math.floor(val)
    rain()
    this._scene.add(group)
    // console.log('rainNumber',rainNumber);
  })
  this.spotLightHelper = this.gui.addFolder('聚光灯')
  var showLine = true
  const params = {
    '辅助线': showLine,
    '颜色': spotLight.color.getHex(),
    '强度': spotLight.intensity,
    '距离': spotLight.distance,
    '角度': spotLight.angle,
    '半影衰减': spotLight.penumbra,
    '距离衰减': spotLight.decay,
    '阴影范围': spotLight.shadow.focus
  };
  this.spotLightHelper.add(params,'辅助线').onChange(function (val) {
    if (val) {
      scene.add(soptLightHelper)
      scene.add(shadowCameraHelper)
      scene.add(soptLightHelper2)
      scene.add(shadowCameraHelper2)
      scene.add(soptLightHelper3)
      scene.add(shadowCameraHelper3)
    }else{
      scene.remove(soptLightHelper)
      scene.remove(shadowCameraHelper)
      scene.remove(soptLightHelper2)
      scene.remove(shadowCameraHelper2)
      scene.remove(soptLightHelper3)
      scene.remove(shadowCameraHelper3)
    }
  });
  // this.spotLightHelper.addColor(params, '颜色').onChange(function (val) {
  //   spotLight.color.setHex(val);
  // });
  this.spotLightHelper.add(params, '强度', 0, 2).onChange(function (val) {
    spotLight.intensity = val;
    spotLight2.intensity = val;
    spotLight3.intensity = val;
  });
  this.spotLightHelper.add(params, '距离', 50, 600).onChange(function (val) {
    spotLight.distance = val;
    spotLight2.distance = val;
    spotLight3.distance = val;
  });
  // this.spotLightHelper.add(params, '角度', 0, Math.PI / 3).onChange(function (val) {
  //   spotLight.angle = val;
  // });
  // this.spotLightHelper.add(params, '半影衰减', 0, 1).onChange(function (val) {
  //   spotLight.penumbra = val;
  // });
  // this.spotLightHelper.add(params, '距离衰减', 0.1, 2).onChange(function (val) {
  //   spotLight.decay = val;
  // });
  // this.spotLightHelper.add(params, '阴影范围', 0, 1).onChange(function (val) {
  //   spotLight.shadow.focus = val;
  // });

  this.sunHelper = this.gui.addFolder('太阳')
  const effectController = {
    '浑浊度': 3,
    '瑞利散射': 3,
    '米氏系数': 0.005,
    '米氏方向': 0.7,
    '太阳高度': 2,
    '太阳方位': 180,
    '曝光级别': this._renderer.toneMappingExposure
  };
  const guiChanged = ()=>{
    
    const uniforms = sky.material.uniforms;
    uniforms['turbidity'].value = effectController['浑浊度'];
    uniforms['rayleigh'].value = effectController[ '瑞利散射' ];
    uniforms['mieCoefficient'].value = effectController[ '米氏系数' ];
    uniforms['mieDirectionalG'].value = effectController[ '米氏方向' ];

    const phi = MathUtils.degToRad( 90 - effectController['太阳高度'] );
    const theta = MathUtils.degToRad( effectController['太阳方位'] );

    sun.setFromSphericalCoords( 1, phi, theta );

    uniforms[ 'sunPosition' ].value.copy( sun );

    this._renderer.toneMappingExposure = effectController['曝光级别'];
    this._renderer.render(this._scene, this._camera)
  }
  this.sunHelper.add( effectController, '浑浊度', 0.0, 20.0, 0.1 ).onChange( guiChanged );
  this.sunHelper.add( effectController, '瑞利散射', 0.0, 4, 0.001 ).onChange( guiChanged );
  this.sunHelper.add( effectController, '米氏系数', 0.0, 0.1, 0.001 ).onChange( guiChanged );
  this.sunHelper.add( effectController, '米氏方向', 0.0, 1, 0.001 ).onChange( guiChanged );
  this.sunHelper.add( effectController, '太阳高度', 0, 90, 0.1 ).onChange( guiChanged );
  this.sunHelper.add( effectController, '太阳方位', - 180, 180, 0.1 ).onChange( guiChanged );
  this.sunHelper.add( effectController, '曝光级别', 0, 2, 0.0001 ).onChange( guiChanged );

  guiChanged();
  // this.spotLightHelper.open();
  // this.sunHelper.open();
  }
}
import { MMDLoader } from "three/examples/jsm/loaders/MMDLoader"
import { MMDAnimationHelper } from "three/examples/jsm/animation/MMDAnimationHelper.js";
import { Audio, AudioLoader, AudioListener } from 'three'
import { AudioAnalyser } from "three";
export var analyser
export class LoadMmd{
  constructor(scene,camera,initGUI){
    this._loader = new MMDLoader();
    this._listener = new AudioListener();
    this.MMDHelper = new MMDAnimationHelper();
    
    
    const modelFile = 'https://mxqy2307-1303879355.cos.ap-guangzhou.myqcloud.com/mmd/keqing2/%E5%88%BB%E6%99%B4.pmx';
    // const modelFile = 'https://mxqy2307-1303879355.cos.ap-guangzhou.myqcloud.com/mmd/babala/babala.pmx';
    // const modelFile = 'https://mxqy2307-1303879355.cos.ap-guangzhou.myqcloud.com/mmd/keqing/%E5%88%BB%E6%99%B4.pmx';
    // const vmdFiles = 'https://mxqy2307-1303879355.cos.ap-guangzhou.myqcloud.com/mmd/action/qingbei.vmd';
    const cameraFiles = 'https://mxqy2307-1303879355.cos.ap-guangzhou.myqcloud.com/mmd/action/jljt-camera.vmd'
    const vmdFiles = 'https://mxqy2307-1303879355.cos.ap-guangzhou.myqcloud.com/mmd/action/jljt.vmd';
    // const vmdFiles = 'https://mxqy2307-1303879355.cos.ap-guangzhou.myqcloud.com/mmd/action/wavefile_v2.vmd';
    const musicUrl = 'https://mxqy2307-1303879355.cos.ap-guangzhou.myqcloud.com/mmd/music/GARNiDELiA%20-%20%E6%A5%B5%E6%A5%BD%E6%B5%84%E5%9C%9F.mp3';
    // const musicUrl = 'https://mxqy2307-1303879355.cos.ap-guangzhou.myqcloud.com/hutao.mp3'

    // this._loader.load(modelFile, mesh => {
    //   this._loader.loadAnimation(vmdFiles,mesh,animation=>{
    //     this.MMDHelper.add(mesh,{ animation: animation,physics: true })
    //     camera.add(this._listener)
    //     new AudioLoader().load(musicUrl, buffer => {
    //       this.audio = new Audio(this._listener)
    //       this.audio.setBuffer(buffer)
    //       this.audio.setVolume(0.5)
    //       this.MMDHelper.add(this.audio, { delayTime: 2 * 60 + 1 })
    //       mesh.castShadow = true;
    //       mesh.position.y = -13;
    //       console.log('mesh',mesh);
    //       console.log('MMDHelper',this.MMDHelper.objects.get( mesh ));
    //       this._physicsHelper = this.MMDHelper.objects.get( mesh ).physics.createHelper()
    //       this._physicsHelper.visible = false
    //       scene.add(mesh)
    //       scene.add(this._physicsHelper)
    //       initGUI()
    //     })
    //   })
    // })

    this._loader.loadWithAnimation( modelFile, vmdFiles, mmd => {
      let mesh = mmd.mesh
      mesh.position.y = -13
      mesh.castShadow = true;
      scene.add(mesh)
      this.MMDHelper.add(mesh,{ animation: mmd.animation,physics: true })
      camera.add(this._listener)
      new AudioLoader().load(musicUrl, buffer => {
        this.audio = new Audio(this._listener).setBuffer(buffer)
        this.audio.setVolume(0.5)
        this.audio.onEnded = ()=>{
          console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeee');
        }
        analyser = new AudioAnalyser(this.audio,512)
        this.MMDHelper.add(this.audio, { delayTime: 160 * 1 / 30 })
        // this._physicsHelper = this.MMDHelper.objects.get( mesh ).physics.createHelper()
        // this._physicsHelper.visible = false
        // scene.add(this._physicsHelper)
        initGUI()
      })
    })
  }
}
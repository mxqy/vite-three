import { BufferGeometry, Material, MaterialLoader, ObjectLoader, SkinnedMesh, Texture, TextureLoader } from 'three';
import { MathUtils, MOUSE, AmbientLight, AxesHelper, BoxBufferGeometry, Vector2, GridHelper, Mesh, MeshPhongMaterial, MeshStandardMaterial, PerspectiveCamera, Scene, Vector3, WebGLRenderer, Object3D, Raycaster, Clock, Audio, AudioLoader, AudioAnalyser, AudioListener, LinearToneMapping, } from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { MMDLoader } from "three/examples/jsm/loaders/MMDLoader"
import { MMDAnimationHelper } from "three/examples/jsm/animation/MMDAnimationHelper.js";
import { TWEEN } from "./tween.module.min.js";
// import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { soptLightHelper,soptLightHelper2,soptLightHelper3, shadowCameraHelper,shadowCameraHelper2,shadowCameraHelper3, guiHelper, } from "./Help"
import { barGroup, boxes, group, obj3D, physics } from './BasicObject';
import { analyser, LoadMmd } from './LoadMmd';
import { spotLight,spotLight2,spotLight3 } from './Light';
import { Group } from 'three';

export class Engine {
  constructor(dom) {
    this._dom = dom
    this._renderer = new WebGLRenderer({
      antialias: true
    })//初始化渲染器
    this._renderer.shadowMap.enabled = true
    this._scene = new Scene()
    this._camera = new PerspectiveCamera(45, dom.offsetWidth / dom.offsetHeight, 1, 2000)//设置相机视角大小，长宽比例，最近/最远可视距离
    this._camera.position.set(100, 100, 100)//设置相机位置
    this._camera.lookAt(new Vector3(0, 0, 0))//相机面向原点
    this._camera.up = new Vector3(0, 1, 0)//摆正相机上下方向
    this._sun = new Vector3()
    this._clock = new Clock();
    this._boxPosition = new Vector3();
    // this._loader = new MMDLoader();
    // this._listener = new AudioListener();
    // this._MMDHelper = new MMDAnimationHelper();
    // this._audioLoader = new AudioLoader();
    this._isPlay = false
    //渲染器设为窗口大小
    this._renderer.setSize(this._dom.offsetWidth, this._dom.offsetHeight);

    /**初始化轨道控制器 */
    const orbitControls = new OrbitControls(this._camera, this._renderer.domElement)
    orbitControls.enableDamping = true //惯性

    //场景跟随窗口大小变化
    this.onWindowResize = () => {
      this._camera.aspect = this._dom.offsetWidth / this._dom.offsetHeight;
      this._camera.updateProjectionMatrix();
      this._renderer.setSize(this._dom.offsetWidth, this._dom.offsetHeight);
    }
    //插入DOM
    dom.appendChild(this._renderer.domElement)
    //播放/暂停
    this.audioPlay = (flag)=>{
      if (flag) {
        mmd.audio.play()//音乐播放
        this._isPlay = true
      } else {
        mmd.audio.pause()//音乐暂停
        this._isPlay = false
      }
    }
    //音量大小
    this.setVolume = (val)=>{
      mmd.audio.setVolume(val)
    }
    //初始化GUI控件
    this.initGUI = () => {
      this._ready = true
      new guiHelper(this._renderer, this._sun, this._scene, this._camera, this.setVolume, this.audioPlay)
    }
    //加载mmd
    const mmd = new LoadMmd(this._scene,this._camera,this.initGUI)
    
    const tween = ( light ) => {

      new TWEEN.Tween( light ).to( {
        angle: ( Math.random() * 0.7 ) + 0.1,
        penumbra: Math.random() + 1
      }, Math.random() * 3000 + 2000 )
        .easing( TWEEN.Easing.Quadratic.Out ).start();

      new TWEEN.Tween( light.position ).to( {
        x: ( Math.random() * 70 ) - 30,
        y: ( Math.random() * 50 ) + 35,
        z: ( Math.random() * 70 ) - 30
      }, Math.random() * 3000 + 2000 )
        .easing( TWEEN.Easing.Quadratic.Out ).start();

        new TWEEN.Tween( light.color ).to( {
          r:  Math.random(),
          g:  Math.random(),
          b:  Math.random()
        }, Math.random() * 3000 + 2000 )
          .easing( TWEEN.Easing.Quadratic.Out ).start();

    }
    const animate = ()=>{
      tween(spotLight)
      tween(spotLight2)
      tween(spotLight3)
      setTimeout( animate, 5000 );
    }
    animate()
    //渐变偏移
    const fn = () => {
      if (barGroup) {
        let arr = barGroup.children.map((item) => {
          return item.children[0].material
        })
        arr.push(arr.splice(0,1)[0])
        barGroup.children.forEach((item,index)=>{
          item.children[0].material = arr[index]
        })
      }
      setTimeout(fn,200)
    }
    fn()
    //渲染
    let bColor = {
      r:100,
      g:0,
      b:0
    }
    if (barGroup) {
      barGroup.children.forEach((item,index)=>{
        if (bColor.r===100&&bColor.g<100&&bColor.b===0) {
          bColor.g+=5
        }else if (bColor.r>0&&bColor.g===100&&bColor.b===0) {
          bColor.r-=5
        }else if (bColor.r===0&&bColor.g===100&&bColor.b<100) {
          bColor.b+=5
        }else if (bColor.r===0&&bColor.g>0&&bColor.b===100) {
          bColor.g-=5
        }else if (bColor.r<100&&bColor.g===0&&bColor.b===100) {
          bColor.r+=5
        }else if (bColor.r===100&&bColor.g===0&&bColor.b>0) {
          bColor.b-=5
        }
        item.children[0].material.color = {
          r:bColor.r/100,
          g:bColor.g/100,
          b:bColor.b/100
        }        
      })
    }
    const renderFun = () => {
      //控制mmd动做更新
      if(this._ready){
      const delta = this._clock.getDelta()
        if (this._isPlay) {
          mmd.MMDHelper.update(delta)
        }
      TWEEN.update();
      //更新聚光灯
      soptLightHelper.update();
      soptLightHelper2.update();
      soptLightHelper3.update();
      //更新阴影
      shadowCameraHelper.update();
      shadowCameraHelper2.update();
      shadowCameraHelper3.update();
      //更新轨道控制器
      orbitControls.update()
      //控制雨滴精灵运动
      group.children.forEach((sprite) => {
        sprite.position.y -= 1;
        if (sprite.position.y < -15) {
          // 如果雨滴落到地面，重置y，从新下落
          sprite.position.y += 200;
        }
      })
      if (analyser) {
        let arr = analyser.getFrequencyData()
        if (barGroup) {
          barGroup.rotation.y += 0.002;
          barGroup.children.forEach((item,index)=>{
            
            if (arr[index]!==0) {
              item.scale.y = arr[index] / 8
              // item.scale.y = (arr[index] / 3 - 100 )<0?((arr[index] - 100 ) / 3):(arr[index] - 100 ) / 3
            }else{
              item.scale.y = 1
            }
          })
        }
      }

      let index = Math.floor( Math.random() * 100 );
      physics&&physics.setMeshPosition( boxes, this._boxPosition.set( 30, Math.random() + 21, -15 ),index );
        
      }
      //更新场景和相机
      this._renderer.render(this._scene,this._camera)
      //循环渲染
      requestAnimationFrame(renderFun)
    }
    renderFun()

    //向场景中添加3D对象
    this.addObject = (...Object3D) => {
      Object3D.forEach(item=>{
        this._scene.add(item)
      })
    }
  }
}
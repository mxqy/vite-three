import{
  AmbientLight,
  Object3D,
  PointLight,
  SpotLight,
  Matrix4
} from 'three'
import { lightMesh,lightMesh2,lightMesh3 } from './BasicObject'

export const lightList = []

/**环境光 */
const ambientLight = new AmbientLight('rgb(255,255,255)',0.5)
/**点光源 */
export const poingLight = new PointLight(0xff0000,0.7,20,0.1)
poingLight.position.set(10,10,8)
//聚光灯
export const spotLight = new SpotLight(0xffffff,0.4,200,Math.PI/180*30)
spotLight.add(lightMesh)
spotLight.position.set(-30,30,-30)
spotLight.castShadow = true
spotLight.decay = 0.1
spotLight.shadow.mapSize.width = 512;
spotLight.shadow.mapSize.height = 512;
spotLight.shadow.camera.near = 10;
spotLight.shadow.camera.far = 300;
spotLight.shadow.focus = 1;
//聚光灯
export const spotLight2 = new SpotLight(0xffffff,0.4,200,Math.PI/180*30)
spotLight2.add(lightMesh2)
spotLight2.position.set(-30,30,-30)
spotLight2.castShadow = true
spotLight2.decay = 0.1
spotLight2.shadow.mapSize.width = 512;
spotLight2.shadow.mapSize.height = 512;
spotLight2.shadow.camera.near = 10;
spotLight2.shadow.camera.far = 300;
spotLight2.shadow.focus = 1;
//聚光灯
export const spotLight3 = new SpotLight(0xffffff,0.4,200,Math.PI/180*30)
spotLight3.add(lightMesh3)
spotLight3.position.set(-30,30,-30)
spotLight3.castShadow = true
spotLight3.decay = 0.1
spotLight3.shadow.mapSize.width = 512;
spotLight3.shadow.mapSize.height = 512;
spotLight3.shadow.camera.near = 10;
spotLight3.shadow.camera.far = 300;
spotLight3.shadow.focus = 1;


lightList.push(ambientLight,spotLight,spotLight2,spotLight3)
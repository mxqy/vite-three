import { pictureTextture, rainTextture} from './Texture';
import { Sky } from 'three/examples/jsm/objects/Sky.js'
import {
  Mesh,
  BoxBufferGeometry,
  MeshStandardMaterial,
  MeshLambertMaterial,
  SphereGeometry,
  Matrix4,
  Vector3,
  Color,
  BoxGeometry,
  InstancedMesh,
  DynamicDrawUsage,
  SphereBufferGeometry,
  Object3D,
  PlaneBufferGeometry,
  Group,
  SpriteMaterial,
  Sprite,
} from 'three'
import { OimoPhysics } from 'three/examples/jsm/physics/OimoPhysics'
import { rainNumber } from './Help';
export const object3DList = []

export let obj3D = {
  //立方体
  box: new Mesh(
    new BoxBufferGeometry(10, 10, 10,),
    new MeshStandardMaterial({
      color:'rgb(255,255,255)',
      map: pictureTextture,
      // metalness:1,//金属度
      roughness: 0//光滑度
    })
  ),
  //图片
  plane : new Mesh(
    new PlaneBufferGeometry(1527,1080),
    new MeshStandardMaterial({
      map:pictureTextture
    })
  ),
  //地面
  stage : new Mesh(
    new BoxBufferGeometry(200,10,200),
    new MeshStandardMaterial({
      color:'rgb(150,150,150)',
      roughness:0//光滑度
    })
  ),
  
}
{
  obj3D.box.position.x = 30
  obj3D.box.position.y = -8
  obj3D.box.position.z = -15
  obj3D.box.castShadow = true
  obj3D.box.render = true
}
{
  obj3D.plane.scale.set(0.05,0.05,0.05)
  obj3D.plane.position.y = 50
  obj3D.plane.render = false
}
{
  obj3D.stage.receiveShadow = true
  obj3D.stage.position.y = -18
  obj3D.stage.render = true
}

// Boxes
export let boxes

const matrix = new Matrix4();
const color = new Color();

const geometryBox = new BoxGeometry( 2, 2, 2 );
boxes = new InstancedMesh( geometryBox, new MeshStandardMaterial({
  color:'rgb(255,255,255)',
  // map: pictureTextture,
  // metalness:1,//金属度
  // roughness: 0.3//光滑度
}), 100 );
boxes.instanceMatrix.setUsage( DynamicDrawUsage ); // will be updated every frame
boxes.castShadow = true;
boxes.receiveShadow = true;
object3DList.push(boxes)
for ( let i = 0; i < 100; i ++ ) {

  matrix.setPosition( 30+Math.random() - 0.5, Math.random() * 2, -15+Math.random() - 0.5 );
  boxes.setMatrixAt( i, matrix );
  boxes.setColorAt( i, color.setHex( 0xffffff * Math.random() ) );
}

export var physics 
async function initPhysics(){
  physics = await OimoPhysics();
  physics.addMesh(obj3D.box);
  physics.addMesh(obj3D.stage);
  physics.addMesh( boxes, 1 );
}
initPhysics()


/**天空 */
export const sky = new Sky();
sky.scale.setScalar(450000)
object3DList.push(sky)


//精灵模型，雨滴
export var group = new Group()
const spriteMaterial = new SpriteMaterial({
  map:rainTextture
})
export function rain(){
  if (group.children.length > rainNumber||group.children.length == rainNumber) {
    group.children.length = rainNumber
  }else{
    for (let index = 0; index < rainNumber-group.children.length; index++) {
      let sprite = new Sprite(spriteMaterial)
      // sprite.scale.set(8, 10, 1)
      var k1 = Math.random() - 0.5;
      var k2 = Math.random() - 0.5;
      var k3 = Math.random() - 0.5;
      sprite.position.set(200 * k1, 200*k3, 200 * k2)
      group.add(sprite);
    }
  }
}
rain()
const countData = 120
export const barGroup = new Group()
const AudioBars = () => {
  let R = 18
  for (let index = 0; index < countData; index++) {
    let minGroup = new Group
    let barBox = new BoxBufferGeometry(0.5,1,0.5)
    let material = new MeshStandardMaterial({
      color:'rgb(255,255,255)'
    })
    let bar = new Mesh(barBox,material)
    minGroup.add(bar)
    minGroup.position.set(
      Math.sin(((index * Math.PI)/countData) * 2) * R,
      -13,
      Math.cos(((index * Math.PI)/countData) * 2) * R
    )
    barGroup.add(minGroup)
  }
  object3DList.push(barGroup)
}
AudioBars()
const bulbGeometry = new SphereGeometry( 1, 16, 8 );
const lightMaterial = new MeshStandardMaterial( {
  emissive: 0xffffee,
  emissiveIntensity: 1,
  color: 0x000000
} )
export const lightMesh = new Mesh( bulbGeometry, lightMaterial) ;
export const lightMesh2 = new Mesh( bulbGeometry, lightMaterial) ;
export const lightMesh3 = new Mesh( bulbGeometry, lightMaterial) ;

for (let mesh in obj3D) {
  if (obj3D[mesh].render) {
    object3DList.push(obj3D[mesh])
  }
}
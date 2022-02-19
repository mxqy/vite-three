import { TextureLoader } from "three";

const textureLoader = new TextureLoader()
//MIKU贴图
export const pictureTextture = textureLoader.load('https://mxqy2307-1303879355.cos.ap-guangzhou.myqcloud.com/img/miku.jpg')
//雨滴贴图
export const rainTextture = textureLoader.load('https://mxqy2307-1303879355.cos.ap-guangzhou.myqcloud.com/img/rain.png')
import * as THREE from "three";
// 导入轨道控制器(实现3维拖动，鼠标拖动)
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入水面
import { Water } from "three/examples/jsm/objects/Water2";
// 导入gltf载入库
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// 导入解压库，因为模型比较大，是压缩的，所以导入解压库解压模型
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
//导入数据加载器
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader"


// 1.创建场景
const scene = new THREE.Scene();
// 2.创建相机（透视相机）
const camera = new THREE.PerspectiveCamera(
  75, //角度
  window.innerWidth / window.innerHeight, //宽高比
  0.1, //近端
  2000 //远端
);
// 3.设置相机的位置，并添加到场景中 x,y,z
camera.position.set(-50, 50, 130);
// // 更新摄像头宽高比例
camera.aspect = window.innerWidth / window.innerHeight;
// // 更新摄像头投影矩阵
camera.updateProjectionMatrix();
// 添加相机到场景中
scene.add(camera);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  // 设置抗锯齿
  antialias: true,
  //因为可能很多个面靠的很近，不知道渲染那个面，所以会闪烁，可以设置  对数深度缓冲区解决
  logarithmicDepthBuffer: true,

})
// 设置编码
renderer.outputEncoding = THREE.sRGBEncoding
// 设置渲染器的大小
renderer.setSize(window.innerWidth, window.innerHeight)



// 监听屏幕大小改变 相机，渲染器做出调整
window.addEventListener('resize',()=>{
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})



// 将渲染器渲染出来的画布添加到页面中
document.body.appendChild(renderer.domElement)

// 实例化控制器(实现3维拖动，鼠标拖动)
const controls = new OrbitControls(camera, renderer.domElement);


//渲染函数
function render(){
  // 渲染场景
  renderer.render(scene,camera)
  // 引擎自动更新渲染器
  requestAnimationFrame(render)
}
render()

// //添加平面
// const planeGeometry = new THREE.PlaneGeometry(100,100)
// const planeMaterial = new THREE.MeshBasicMaterial({color:0xffffff})
// const plane = new THREE.Mesh(planeGeometry,planeMaterial)
// scene.add(plane)

// 创建一个巨大的天空球体
let texture = new THREE.TextureLoader().load("./textures/sky.jpg") //加载纹理
const skyGeometry = new THREE.SphereGeometry(1000,60,60)
const skyMaterial = new THREE.MeshBasicMaterial({
  map:texture //天空纹理
})
//球面翻转过来，原来本身里面是黑的，z轴-1，实现翻转，里亮外黑
skyGeometry.scale(1,1,-1)
const sky = new THREE.Mesh(skyGeometry,skyMaterial)
scene.add(sky)

// 视频纹理
const video = document.createElement("video")
video.src = "./textures/sky.mp4"
video.loop = true

window.addEventListener('click',(e)=>{
  // 鼠标移动播放视频
  // 判断视频是否处于播放状态
  if(video.paused){
    video.play()
    skyMaterial.map = new THREE.VideoTexture(video)
    skyMaterial.map.needsUpdate = true
  }
})


// 加载hdr 环境图(单张图)，周围的环境才会有光
const rgbeLoader = new RGBELoader()
//因为加载的资源比较大，所以异步加载
rgbeLoader.loadAsync("./assets/050.hdr").then(texture => {
  // 背景是球形的
  texture.mapping = THREE.EquirectangularReflectionMapping
  // 设置背景
  scene.background = texture;
  // 设置环境的纹理
  scene.environment = texture
})

const light = new THREE.DirectionalLight(0xffffff,1)
light.position.set(-100,100,10)
scene.add(light)

// 创建水面
const waterGeometry = new THREE.CircleBufferGeometry(300,64)
const water = new Water(waterGeometry,{
  textureWidth:1024,
  texturesHeight:1024,
  color:0xffffff,
  flowDirection:new THREE.Vector2(1,1),
  scale:1 //波纹
})
//提高水平面，淹过水头
water.position.y = 3
// 水面旋转至水平
water.rotation.x = -Math.PI /2
scene.add(water)

// 添加小岛模型
// 实例化gltf载入库
const loader = new GLTFLoader()
// 实例化draco载入库
const dracoLoader = new DRACOLoader()
// 添加draco载入库
dracoLoader.setDecoderPath('./draco/')
// 添加draco载入库
loader.setDRACOLoader(dracoLoader)

loader.load("./model/island2.glb",(gltf)=>{
  scene.add(gltf.scene);
})
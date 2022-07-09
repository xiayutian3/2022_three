import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//导入动画库
import gsap from "gsap";
// 导入dat.gui库
import * as dat from 'dat.gui';


// 目标 环境贴图 

// 1.创建场景
const scene = new THREE.Scene();
// 2.创建相机（透视相机）
const camera = new THREE.PerspectiveCamera(
  75, //角度
  window.innerWidth / window.innerHeight, //宽高比
  0.1, //近端
  1000 //远端
);
// 3.设置相机的位置，并添加到场景中 x,y,z
camera.position.set(0, 0, 10);
scene.add(camera);

//创建div插入body中,用于显示加载进度
var div= document.createElement('div')
div.style.width = "200px"
div.style.height = "200px"
div.style.position = "fixed"
div.style.right = 0
div.style.top = 0
div.style.color = "#fff"
document.body.appendChild(div)

let event = {}
// 单张纹理图的加载
event.onLoad = function() {
  console.log('图片加载完成')
}
// 进度
event.onProgress = function(url, itemsLoaded, itemsTotal) {
  // console.log('e: ', e);
  console.log('图片加载完成: ', url);
  console.log('图片加载进度',itemsLoaded)
  console.log('图片加载总数',itemsTotal)
  let value= (itemsLoaded/itemsTotal*100).toFixed(2)+ '%'
  console.log('加载进度', value)
  div.innerHTML = value
}
// 错误
event.onError = function(e) {
  console.log('e: ', e);
  console.log('图片加载错误')
}

// 设置加载管理器(管理所有的资源加载)
const loadingManager = new THREE.LoadingManager(
  event.onLoad,
  event.onProgress,
  event.onError
);



// 设置cube纹理加载器
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
// 加载环境贴图
const envMapTexture = cubeTextureLoader.load([
  "textures/environmentMaps/1/px.jpg",
  "textures/environmentMaps/1/nx.jpg",
  "textures/environmentMaps/1/py.jpg",
  "textures/environmentMaps/1/ny.jpg",
  "textures/environmentMaps/1/pz.jpg",
  "textures/environmentMaps/1/nz.jpg",
])


// 4.添加物体
// 创建 球 几何体
const sphereGeometry = new THREE.SphereBufferGeometry(1,20,20)
// 材质
const material = new THREE.MeshStandardMaterial( {
  metalness:0.7, //金属感
  roughness:0.1, //光滑感
  // envMap:envMapTexture, //添加环境贴图
})
// 合成物体
const sphere = new THREE.Mesh(sphereGeometry,material);
scene.add(sphere)
// 添加场景的背景贴图
scene.background = envMapTexture
// 给场景所有的物体添加默认的环境贴图（就是根据背景映射到物体上边，显示出的东西，就像照镜子一样）
scene.environment = envMapTexture


// 灯光
// // AmbientLight(环境光，从四面八方打过来)
// // color - (参数可选）颜色的rgb数值。缺省值为 0xffffff。
// //   intensity - (参数可选)光照的强度。缺省值为 1。
const light = new THREE.AmbientLight( 0xffffff,0.5 ); // soft white light
scene.add(light);
// 直线光源 平行光 （如太阳）
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
//设置位置
directionalLight.position.set(10,10,10)
scene.add(directionalLight);



// 5.初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染器尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// console.log('renderer: ', renderer);

//将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

// // 6.使用渲染器，通过相机将场景渲染进来
// renderer.render(scene,camera)

// 7.创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，让控制器更有真实感，必须在动画循环里调用.update()
controls.enableDamping = true;

// 8.添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 设置时钟
const clock = new THREE.Clock();

//js控制全屏
window.addEventListener("dblclick", () => {
  const fullScreenElement = document.fullscreenElement;
  if (!fullScreenElement) {
    //双击控制屏幕进入全屏，退出全屏
    renderer.domElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

function render() {
  // 移动真实感
  controls.update();
  renderer.render(scene, camera);
  //渲染下一帧，就会调用render
  requestAnimationFrame(render);
}
render();

//监听画面的变化，更新渲染画面
window.addEventListener("resize", () => {
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  // 更新渲染器的大小
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});

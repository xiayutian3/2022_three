import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//导入动画库
import gsap from "gsap";
// 导入dat.gui库
import * as dat from 'dat.gui';

// 目标 纹理的显示算法

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

// 导入纹理
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("./textures-before/door/door.webp")
// 128X128小图片
const texture = textureLoader.load("./textures-before/xin.webp")

// 设置纹理偏移
// doorColorTexture.offset.x = 0.5
// doorColorTexture.offset.y = 0.5
// doorColorTexture.offset.set(0.5,0.5)

// // 纹理旋转
// // 设置旋转原点为中心点，旋转45度
// doorColorTexture.center.set(0.5,0.5)
// doorColorTexture.rotation = - Math.PI / 4 //默认逆时针旋转

// // 设置纹理的重复(水平重复两次，竖直方向重复3次)
// doorColorTexture.repeat.set(2,3)
// // 设置纹理重复模式
// // doorColorTexture.wrapS = THREE.RepeatWrapping
// doorColorTexture.wrapS = THREE.MirroredRepeatWrapping //进行镜像重复，像照镜子一样，重复
// doorColorTexture.wrapT = THREE.RepeatWrapping


// texture 纹理的显示设置
// texture.minFilter = THREE.NearestFilter
// texture.mapFilter = THREE.NearestFilter
texture.minFilter = THREE.LinearFilter
texture.mapFilter = THREE.LinearFilter

// 4.添加物体
// 创建几何体
const cubeGeometry = new THREE.BoxBufferGeometry(1,1,1);
//材质
const basicMaterial = new THREE.MeshBasicMaterial({ 
  color:'#ffff00',
  // map:doorColorTexture  //添加纹理
  map:texture
})
//根据几何体，材质合成物体
const cube = new THREE.Mesh( cubeGeometry, basicMaterial)
// 添加到场景
scene.add(cube)

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

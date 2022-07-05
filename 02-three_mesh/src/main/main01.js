import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//导入动画库
import gsap from "gsap";
// 导入dat.gui库
import * as dat from 'dat.gui';

// 目标 简易的实现一个面

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

// 4.添加物体
// 创建几何体
const geometry = new THREE.BufferGeometry()
const vertices = new Float32Array([ //(逆时针)创建6个顶点，一个面由两个三角形，6个顶点构成
-1.0, -1.0,  1.0,
1.0, -1.0,  1.0,
1.0,  1.0,  1.0,

1.0,  1.0,  1.0,
-1.0,  1.0,  1.0,
-1.0, -1.0,  1.0
])
// 设置几何体顶点，已3个数，为一个顶点坐标
geometry.setAttribute("position",new THREE.BufferAttribute(vertices,3))
// 材质，光泽等
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// 根据几何体和材质创建物体
const mesh = new THREE.Mesh(geometry,material)
console.log('mesh: ', mesh);
// 将几何体添加到场景中
scene.add(mesh);

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

import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//导入动画库
import gsap from "gsap";
// 导入dat.gui库
import * as dat from 'dat.gui';
//导入数据加载器
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader"

// 目标 点光源


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
// 创建 球 几何体
const sphereGeometry = new THREE.SphereBufferGeometry(1,20,20)
// 材质
const material = new THREE.MeshStandardMaterial()
// 合成物体
const sphere = new THREE.Mesh(sphereGeometry,material);
// 投射阴影
sphere.castShadow = true;
scene.add(sphere)

//创建平面
const planeGeometry = new THREE.PlaneBufferGeometry(50,50)
const plane = new THREE.Mesh(planeGeometry,material)
plane.position.set(0,-1,0)
plane.rotation.x = -Math.PI / 2
// 接受阴影
plane.receiveShadow = true;
scene.add(plane)


// 设置小球绑定灯光
const smallBall = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.1,20,20),
  new THREE.MeshBasicMaterial({color:0xff0000})
)
smallBall.position.set(2,2,2)

// 灯光
// // AmbientLight(环境光，从四面八方打过来)
// // color - (参数可选）颜色的rgb数值。缺省值为 0xffffff。
// //   intensity - (参数可选)光照的强度。缺省值为 1。
const light = new THREE.AmbientLight( 0xffffff,0.5 ); // soft white light
scene.add(light);
// 点光源
const pointLight  = new THREE.PointLight( 0xff0000, 1 );
// 设置亮度 光的强度
// spotLight.intensity = 2
//设置位置
// pointLight.position.set(2,2,2)
//开启灯光的阴影
pointLight.castShadow = true

// 设置阴影贴图的模糊度
pointLight.shadow.radius = 20
// 设置阴影贴图的分辨率
pointLight.shadow.mapSize.set(4096,4096)


// // 从光源发出光的最大距离，其强度根据光源的距离线性衰减
// pointLight.distance = 0
// // 沿着光照距离的衰减量
// pointLight.decay = 0

//将小球和灯光绑定在一起
smallBall.add(pointLight)
// scene.add(pointLight);
scene.add(smallBall);



// 创建gui界面
const gui = new dat.GUI()
// 调节x变量
gui.add(smallBall.position,"x").min(-5).max(5).step(0.1)
gui.add(pointLight,"distance").min(0).max(10).step(0.01)
gui.add(pointLight,"decay").min(0).max(5).step(0.01)



// 5.初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染器尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// console.log('renderer: ', renderer);
//开启场景中的阴影贴图
renderer.shadowMap.enabled = true
// 是否使用物理上正确的光照模式,用于查看spotLight.decay
renderer.physicallyCorrectLights = true

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
  // 灯光运动(圆周运动)
  let time = clock.getElapsedTime()
  smallBall.position.x = Math.sin(time)*3
  smallBall.position.z = Math.cos(time)*3
  // smallBall.position.y = 2 + Math.sin(time*10)

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

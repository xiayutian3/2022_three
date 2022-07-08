import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//导入动画库
import gsap from "gsap";
// 导入dat.gui库
import * as dat from 'dat.gui';

// 目标 设置粗糙度与粗糙度贴图 + 法线贴图

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
const doorColorTexture = textureLoader.load("./textures/door/color.jpg");
// // 透明纹理
const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg");
// 环境遮挡贴图
const doorAoTexture = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg"
);
// 导入置换贴图
const doorHeightTexture = textureLoader.load("./textures/door/height.jpg");
// 导入粗糙度贴图
const roughnessTexture = textureLoader.load("./textures/door/roughness.jpg")
// 导入金属贴图
const metalnessTexture = textureLoader.load("./textures/door/metalness.jpg")
// 导入法线贴图
const normalTexture = textureLoader.load("./textures/door/normal.jpg")


// 4.添加物体
// 创建几何体
const cubeGeometry = new THREE.BoxBufferGeometry(1,1,1,100,100,100);
//材质
const material = new THREE.MeshStandardMaterial({ 
  color:'#ffff00',
  map:doorColorTexture,  //添加纹理
  alphaMap:doorAlphaTexture, // 添加透明纹理
  transparent: true,    //定义材质是否透明
  // opacity:0.5, //设置透明度
  // side: THREE.DoubleSide, //定义将要渲染哪一面 默认正面
  aoMap: doorAoTexture,   //环境遮挡贴图
  aoMapIntensity:1, //环境遮挡效果的强度。默认值为1。零是不遮挡效果
  displacementMap:doorHeightTexture, //导入置换贴图
  displacementScale :0.1, //导入置换贴图,突出程度
  roughness:1, //修改材质的粗糙程度
  roughnessMap:roughnessTexture,  //导入粗糙度贴图
  metalness:1,  //材质与金属的相似度
  metalnessMap:metalnessTexture,//导入金属贴图
  normalMap:normalTexture,  //导入法线贴图

})
material.side = THREE.DoubleSide;
//根据几何体，材质合成物体
const cube = new THREE.Mesh( cubeGeometry, material)
//给cubeGeometry设置第二组uv
cubeGeometry.setAttribute('uv2',new THREE.BufferAttribute(cubeGeometry.attributes.uv.array,2))
// 添加到场景
scene.add(cube)

// 添加平面
const planeGeometry = new THREE.PlaneBufferGeometry(1,1,200,200)
const plane = new THREE.Mesh(
  planeGeometry,
  material
)
plane.position.set(1.5,0,0)
// 添加到场景
scene.add(plane)
// console.log('plane: ', plane);
//给平面设置第二组uv
planeGeometry.setAttribute('uv2',new THREE.BufferAttribute(planeGeometry.attributes.uv.array,2))


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

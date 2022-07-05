import * as THREE from 'three'
// 导入轨道控制器
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

// 目标 Clock 该对象用于跟踪时间

// 1.创建场景
const scene = new THREE.Scene();
// 2.创建相机（透视相机）
const camera = new THREE.PerspectiveCamera(
  75, //角度
  window.innerWidth/window.innerHeight, //宽高比
  0.1, //近端
  1000 //远端
)
// 3.设置相机的位置，并添加到场景中 x,y,z
camera.position.set(0, 0, 10)
scene.add(camera)

// 4.添加物体
// 创建几何体
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// 材质，光泽等
const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
// 根据几何体和材质创建物体
const cube = new THREE.Mesh( geometry, material );

// 修改物体的位置
// cube.position.set(5,0,0)
// cube.position.x = 3

//缩放
// cube.scale.set(3,2,1)
// cube.scale.x = 5

// 旋转
// cube.rotation.set(Math.PI /4,0,0,'xzy')


// 将几何体添加到场景中
scene.add( cube );
// console.log(cube)

// 5.初始化渲染器
const renderer = new THREE.WebGLRenderer()
// 设置渲染器尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// console.log('renderer: ', renderer);

//将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)


// // 6.使用渲染器，通过相机将场景渲染进来
// renderer.render(scene,camera)


// 7.创建轨道控制器
const controls = new OrbitControls(camera,renderer.domElement)


// 8.添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 设置时钟
const clock = new THREE.Clock()
function render(){
  

  let time = clock.getElapsedTime() //已秒为单位
  console.log('时钟运行的总时长',time)

  // let deltaTime = clock.getDelta()
  // console.log('两次获取时间的间隔时间',deltaTime)

  let t = time % 5
  cube.position.x = t*1


  renderer.render(scene,camera)
  //渲染下一帧，就会调用render
  requestAnimationFrame(render)
}
render()
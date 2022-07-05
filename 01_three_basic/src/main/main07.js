import * as THREE from 'three'
// 导入轨道控制器
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
//导入动画库
import gsap from 'gsap'

// 目标 掌握gsap设置各种动画效果

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

// 设置动画 移动的物体，x 移动的属性 移动到5的位置  duration 过度的时间 5s  ease动画效果
const animate1 = gsap.to(cube.position,{x:5,duration:5,ease:"power1.inOut",
//设置重复的次数，无线循环是-1
repeat:2,
// 往返运动
yoyo:true,
// 延迟时间 s
delay:1,
onComplete:()=>{
  console.log("动画完成")
},
onStart:()=>{
  console.log("动画开始")
}
})
gsap.to(cube.rotation,{x:2*Math.PI,duration:5,ease:"power1.inOut"})

//监听双击事件，停止动画 animate1
window.addEventListener('dblclick',()=>{
  console.log(animate1)
  // animate1.pause();  //注意这里是没有d的
  // // animate1.paused( true ); //也可以这样

  if(animate1.isActive()){ //如果是运动的状态
    //暂停
    animate1.pause()
  }else{
    // 恢复
    animate1.resume()
  }
})


function render(){
  renderer.render(scene,camera)
  //渲染下一帧，就会调用render
  requestAnimationFrame(render)
}
render()
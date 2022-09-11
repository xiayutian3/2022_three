<template>
 <div class="home">
    <div class="canvas-container" ref="canvasDom"></div>
 </div>
</template>

<script setup>
import * as THREE from "three";
import { onMounted, reactive, ref } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


let controls;
let canvasDom = ref(null);
// 创建场景
const scene = new THREE.Scene();
// 创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// 设置相机位置
camera.position.set(0, 2, 6);
// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  // 抗锯齿
  antialias: true,
});
// 设置渲染器大小
renderer.setSize(window.innerWidth, window.innerHeight);

// 渲染函数
const render = () => {
  renderer.render(scene, camera);
  // 控制器可以不断 更新视角
  controls && controls.update();
  requestAnimationFrame(render);
};

onMounted(()=>{
  // 把渲染器插入Dom中
  canvasDom.value.appendChild(renderer.domElement);
   // 初始化渲染器，渲染背景
  renderer.setClearColor("#000");
  //背景色
  scene.background = new THREE.Color("#ccc");
  //环境
  scene.environment = new THREE.Color("#ccc");
  render();

  // 添加网格地面
  const gridHelper = new THREE.GridHelper(10, 10);
  gridHelper.material.opacity = 0.2; //透明度
  gridHelper.material.transparent = true; //开启透明
  scene.add(gridHelper);

  // 添加控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.update();
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>

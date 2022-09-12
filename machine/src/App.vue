<template>
   <div class="canvas-container" ref="screenDom"></div>
</template>

<script setup>
import * as THREE from "three";
import { ref, onMounted, onUnmounted } from "vue";
// 控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 加载hdr纹理
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
// glb模型加载loader
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// 解压缩工具，因为模型导出的时候压缩了
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
// 镜面反射库
import { Reflector } from "three/examples/jsm/objects/Reflector";

let screenDom = ref(null);
onMounted(()=>{
  // 创建场景
  let scene = new THREE.Scene();
    // 创建相机
  let camera = new THREE.PerspectiveCamera(
    75, //视角
    screenDom.value.clientWidth / screenDom.value.clientHeight,
    0.1,
    1000
  );
  // 设置相机位置
  camera.position.set(0, 1.5, 6);
  // 创建渲染器 设置抗锯齿，使边缘变得更加光滑
  let renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(screenDom.value.clientWidth, screenDom.value.clientHeight); // 设置大小
  // 添加到dom中
  screenDom.value.appendChild(renderer.domElement);

  // 创建辅助坐标轴
  let axes = new THREE.AxesHelper(5);
  scene.add(axes);

  // 添加控制器
  let control = new OrbitControls(camera, renderer.domElement);

    // 创建rgbe加载器  （加载 天空点点星星背景）
  let hdrLoader = new RGBELoader();
  hdrLoader.load("./assets/sky12.hdr", (texture) => {
    // 设置映射为球形
    texture.mapping = THREE.EquirectangularReflectionMapping;
    // 设置背景，环境都为 纹理资源
    scene.background = texture;
    scene.environment = texture;
  });

  // 添加机器人
  // 设置解压缩的加载器
  let dracoLoader = new DRACOLoader(); // 解压缩工具
  dracoLoader.setDecoderPath("./draco/gltf/"); // 设置gltf解压缩工具路径
  dracoLoader.setDecoderConfig({ type: "js" }); //设置文件的类型
  let gltfLoader = new GLTFLoader(); //模型加载器
  gltfLoader.setDRACOLoader(dracoLoader); //设置模型加载器的解压缩工具
  gltfLoader.load("./assets/robot.glb", (gltf) => { //解压加载资源
    scene.add(gltf.scene); // 添加到场景中
  });

  // 添加直线光
  let light1 = new THREE.DirectionalLight(0xffffff, 0.3);
  light1.position.set(0, 10, 10);
  let light2 = new THREE.DirectionalLight(0xffffff, 0.3);
  light1.position.set(0, 10, -10);
  let light3 = new THREE.DirectionalLight(0xffffff, 0.8);
  light1.position.set(10, 10, 10);
  scene.add(light1, light2, light3);

  // 添加光阵
  let video = document.createElement("video");
  video.src = "./assets/zp2.mp4";
  video.loop = true;
  video.muted = true;//只用静音才能自动播放
  video.play();
  let videoTexture = new THREE.VideoTexture(video);//获取视频的纹理
  const videoGeoPlane = new THREE.PlaneBufferGeometry(8, 4.5); //创建平面 视频16:9大小，保持比例
  const videoMaterial = new THREE.MeshBasicMaterial({ //材质
    map: videoTexture, //添加视频纹理
    transparent: true, //是否透明
    side: THREE.DoubleSide, //两边都可以看到
    alphaMap: videoTexture, //设置透明纹理，黑色透明，有颜色的不透明
  });
  // 合成光阵物体
  const videoMesh = new THREE.Mesh(videoGeoPlane, videoMaterial);
  // 抬高位置一点点
  videoMesh.position.set(0, 0.2, 0);
  // 设置旋转角度 
  videoMesh.rotation.set(-Math.PI / 2, 0, 0);
  scene.add(videoMesh);

   // 添加镜面反射
  let reflectorGeometry = new THREE.PlaneBufferGeometry(100, 100);
  let reflectorPlane = new Reflector(reflectorGeometry, {
    textureWidth: window.innerWidth,
    textureHeight: window.innerHeight,
    color: 0x332222,
  });
  // 旋转角度 
  reflectorPlane.rotation.x = -Math.PI / 2;
  scene.add(reflectorPlane);

  // 添加渲染函数
  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
  render();

    // 监听画面变化，更新渲染画面
  window.addEventListener("resize", () => {
    //   console.log("画面变化了");
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight;
    //   更新摄像机的投影矩阵
    camera.updateProjectionMatrix();

    //   更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    //   设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio);
  });


})
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
.canvas-container {
  width: 100vw;
  height: 100vh;
}
</style>

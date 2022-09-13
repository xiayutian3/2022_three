<template>
  <div class="home">
    <div class="canvas-container" ref="screenDom"></div>
    <div class="header">
      <div class="logo"></div>
      <div class="menu">
        <a href="https://www.cpengx.cn/" class="menuItem">首页</a>
        <a
          href="https://www.cpengx.cn/%e8%af%be%e7%a8%8b%e6%ba%90%e7%a0%81"
          class="menuItem"
          >课程源码</a
        >
        <a href="https://www.cpengx.cn/moxing" class="menuItem">素材模型</a>
      </div>
    </div>
    <div class="pages" ref="pages">
      <div class="page">
        <h2 class="title">老陈带你学前端</h2>
        <p>轻松、好玩、有趣掌握前沿硬核前端技术</p>
      </div>
      <div class="page">
        <h2 class="title">WEB 3D可视化</h2>
        <p>领略WEB 3D的魅力，让页面无比酷炫</p>
      </div>
      <div class="page">
        <h2 class="title">ThreeJS框架</h2>
        <p>让前端开发3D效果更方便</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { ref, onMounted } from "vue";
// 加载 glb 模型的loader
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// 解压缩工具，因为模型导出的时候压缩了
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
// 导入动画库  gsap设置各种动画效果
import { gsap } from "gsap";

let screenDom = ref(null);
let pages = ref(null);
onMounted(() => {
    // 创建场景
  let scene = new THREE.Scene();
  // 创建相机
  let camera = new THREE.PerspectiveCamera(
    45,//角度
    window.innerWidth / window.innerHeight,
    0.1,
    100000
  );
  // 设置相机的位置
  camera.position.set(0, 0, 10);
  // 创建渲染器  antialias 抗锯齿，让边缘看起来更圆滑
  let renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);//设置渲染器的大小
  // 将画布添加到页面中
  screenDom.value.appendChild(renderer.domElement);

  // 创建星空的背景
  let url = "./assets/25s.jpg";
  let envTexture = new THREE.TextureLoader().load(url);
  // 背景是球形的
  envTexture.mapping = THREE.EquirectangularReflectionMapping;
  // 给场景的背景，环境添加纹理
  scene.background = envTexture;
  scene.environment = envTexture;

  // 渲染动画帧函数
  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
  render();

    // 添加灯光
  let light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 0, 1);
  scene.add(light);
  let light2 = new THREE.DirectionalLight(0xffffff, 0.5);
  light2.position.set(0, 0, -1);
  scene.add(light2);
  // 环境光会均匀的照亮场景中的所有物体。
  let light3 = new THREE.AmbientLight(0xffffff, 0.5);
  light3.position.set(-1, 1, 1);
  scene.add(light3);

 // 设置解压缩的加载器
  let dracoLoader = new DRACOLoader();
  // 设置解压缩工具文件路径
  dracoLoader.setDecoderPath("./draco/gltf/");
  // 设置解压缩工具文件类型
  dracoLoader.setDecoderConfig({ type: "js" });
  // glb模型加载器
  let loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  // 加载第一个模型
  loader.load("./model/xz.glb", (gltf) => {
    // 设置大小
    gltf.scene.scale.set(0.1, 0.1, 0.1);
    // 设置位置
    gltf.scene.position.set(3, 0, 0);
    scene.add(gltf.scene); //添加到场景中

    // 鼠标移动
    window.addEventListener("mousemove", (e) => {
      // 范围 -1 -  1   弧度制 -60度 到 60度 左右
      let x = (e.clientX / window.innerWidth) * 2 - 1;
      let y = (e.clientY / window.innerHeight) * 2 - 1;

      //创建动画
      let timeline = gsap.timeline();
      timeline.to(gltf.scene.rotation, {
        duration: 0.5,
        x: y,
        y: x,
        duration: 1,
      });
    });
  })

  // 加载第二个模型
  loader.load("./model/xq6.glb", (gltf) => {
    // 设置大小
    gltf.scene.scale.set(0.1, 0.1, 0.1);
    // 设置位置
    gltf.scene.position.set(3, -8, 0);
    scene.add(gltf.scene); //添加到场景中

    // 鼠标移动
    window.addEventListener("mousemove", (e) => {
      // 范围 -1 -  1   弧度制 -60度 到 60度 左右
      let x = (e.clientX / window.innerWidth) * 2 - 1;
      let y = (e.clientY / window.innerHeight) * 2 - 1;

      //创建动画
      let timeline = gsap.timeline();
      timeline.to(gltf.scene.rotation, {
        duration: 0.5,
        x: y,
        y: x,
        duration: 1,
      });
    });
  })

  // 加载第三个模型
  loader.load("./model/gr75.glb", (gltf) => {
    // // 设置大小
    // gltf.scene.scale.set(0.1, 0.1, 0.1);
    // 设置位置
    gltf.scene.position.set(3, -16, 0);
    scene.add(gltf.scene); //添加到场景中

    // 鼠标移动
    window.addEventListener("mousemove", (e) => {
      // 范围 -1 -  1   弧度制 -60度 到 60度 左右
      let x = (e.clientX / window.innerWidth) * 2 - 1;
      let y = (e.clientY / window.innerHeight) * 2 - 1;

      //创建动画
      let timeline = gsap.timeline();
      timeline.to(gltf.scene.rotation, {
        duration: 0.5,
        x: y,
        y: x,
        // duration: 1,
      });
    });
  })

  // 分屏逻辑
  // three是移动相机的位置，页面是移动y轴的位置
  let page = 0;
  let timeline2 = gsap.timeline();
  // 监听鼠标滚轮
  window.addEventListener("mousewheel", (e) => {
    if (e.wheelDelta < 0) { //向下
      page++;
      if (page > 2) { // 因为只有3屏，从0开始
        page = 2;
      }
    }
    if (e.wheelDelta > 0) {//向上
      page--;
      if (page < 0) {
        page = 0;
      }
    }
    if (!timeline2.isActive()) { // 正在移动不做处理
      timeline2.to(camera.position, { //移动相机的位置
        duration: 0.5,
        y: page * -8,
        // duration: 1,
      });
      gsap.to(pages.value, { //移动页面y轴的位置
        duration: 1,
        y: -page * window.innerHeight,
        // duration: 1,
      });
    }
  });

  // 加载星球
  loader.load("./model/moon.glb", (gltf) => {
    let moon = gltf.scene.children[0];  //得到与月球
    for (let j = 0; j < 10; j++) {
      let moonInstance = new THREE.InstancedMesh(// 实例化网格
        moon.geometry, //月球几何体
        moon.material, //月球材质
        100 //数量
      );

      // scene.add(moon);
      for (let i = 0; i < 100; i++) {
        let x = Math.random() * 1000 - 500;
        let y = Math.random() * 1000 - 500;
        let z = Math.random() * 1000 - 500;

        // 创建矩阵
        let matrix = new THREE.Matrix4();
        // 大小
        let size = Math.random() * 20 - 8;
        // 设置大小
        matrix.makeScale(size, size, size);
        // 设置位置
        matrix.makeTranslation(x, y, z);
        // 赋值矩阵给实例化的月球
        moonInstance.setMatrixAt(i, matrix);
      }

      // 添加星球远去的动画
      gsap.to(moonInstance.position, {
        duration: Math.random() * 10 + 2, //过度时间
        z: -1000,  //z轴运动到-1000，//产生离我们远去的感觉
        ease: "linear",// 线性运动
        repeat: -1, //往返运动
      });
      scene.add(moonInstance);
    }
  });



})




</script>

<style>
* {
  margin: 0;
  padding: 0;
}
body {
  background-color: #000;
}
.canvas-container {
  width: 100vw;
  height: 100vh;
}
.home {
  width: 100vw;
  height: 100vh;
  transform-origin: 0 0;
}
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header .logo {
  height: 100px;
  width: 300px;
  background-image: url("./assets/lcdm.png");
  background-size: 60%;
  background-position: center;
  background-repeat: no-repeat;
}
.canvas-container {
  width: 100%;
  height: 100%;
}
.menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 50px;
}
.menuItem {
  padding: 0 15px;
  text-decoration: none;
  color: #fff;
  font-weight: 900;
  font-size: 15px;
}
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url(./assets/loading.jpg);
  background-size: cover;
  filter: blur(50px);
  z-index: 100;
}
.progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 101;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #fff;
}
.progress > img {
  padding: 0 15px;
}

/* .title {
  width: 380px;
  height: 40px;
  position: fixed;
  right: 100px;
  top: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  line-height: 40px;
  text-align: center;
  color: #fff;
  border-radius: 5px;
  z-index: 110;
} */
.pages {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
}
.pages .page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: #fff;
  padding: 15%;
  box-sizing: border-box;
}
.pages .page .title {
  font-size: 50px;
  font-weight: 900;
  margin-bottom: 20px;
}
.pages .page p {
  font-size: 25px;
}
</style>


// 导弹飞行演示
// 导入THREE.js
import * as THREE from "three";
// 导入控制器 THREE.OrbitControls
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入THREE.GLTFLoader 加载器
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// 导入着色器代码
import fragmentShader from '../shader/fragmentShader.glsl'

// 创建场景
let scene = new THREE.Scene();
// 创建相机
let camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,1000)
// 设置相机位置
camera.position.set(0,0,5)
scene.add(camera)


// 创建渲染器
let renderer = new THREE.WebGLRenderer()
// 设置渲染器尺寸
renderer.setSize(window.innerWidth, window.innerHeight)
// 将渲染器添加到页面中
document.body.appendChild(renderer.domElement)

// 创建控制器
let controls = new OrbitControls(camera, renderer.domElement)


// 加载导弹模型、乌克兰地图、俄罗斯地图、导弹曲线
let missile
let mapwkl
let mapels
let curvePath
// gltf模型加载
let loader = new GLTFLoader()
loader.load(
  // 模型路径
  "./assets/ew8.glb",
  // 加载成功回调
  function(gltf){
    console.log('gltf: ', gltf);
    // 将加载的模型添加到场景中（整个添加场景中了）
    // scene.add(gltf.scene)
    // 获取模型中的导弹
    missile = gltf.scene.children[3]
    // 获取模型中的乌克兰地图
    mapwkl = gltf.scene.children[1]
    // 获取模型中的俄罗斯地图
    mapels = gltf.scene.children[0]
    // 获取模型中的曲线
    curvePath = gltf.scene.children[2]
    // // 添加物体到场景中 
    scene.add(missile)
    scene.add(mapwkl)
    scene.add(mapels)

    // 根据点创建曲线
    let points = []
    for(let i=curvePath.geometry.attributes.position.count - 1;i>=0 ;i--){
    // for(let i=0;i<curvePath.geometry.attributes.position.count;i++){
      points.push(
        new THREE.Vector3(
          curvePath.geometry.attributes.position.array[i * 3],
          curvePath.geometry.attributes.position.array[i * 3 + 1],
          curvePath.geometry.attributes.position.array[i * 3 + 2],
        )
      )
    }
    //创建曲线
    curvePath = new THREE.CatmullRomCurve3(points)
  },
  // 加载进度回调
  function(xhr){
    console.log(xhr.loaded/xhr.total) * 100 +'% loaded'
  },
  // 加载失败回调
  function(error){
    console.log("an error happended")
  }
)


// 创建平行光
let light = new THREE.DirectionalLight(0xffffff,1)
// 设置光源的位置
light.position.set(0,10,5)
// 将光源添加到场景中
scene.add(light)

// 再添加一个平行光
let light2 = new THREE.DirectionalLight(0xffffff,0.5)
// 设置光源的位置
light2.position.set(0,-10,-5)
// 将光源添加到场景中
scene.add(light2)

const params = {
  iTime:{
    value:0
  }
}

// 添加爆炸声
const listener = new THREE.AudioListener()
const sound = new THREE.Audio(listener)
const audioLoader = new THREE.AudioLoader()
audioLoader.load("./assets/bomb.mp3",function(buffer){
  sound.setBuffer(buffer)
  // sound.setLoop(true)
  // sound.setVolume(0.5)
  // sound.play()
})

// 创建时间
let clock = new THREE.Clock()
// 创建渲染函数
function render(){
  // 设置5s循环一次
  let t = clock.getElapsedTime() % 5;
  // 0-1 范围
  t = t / 5;
  // 设置导弹飞行路径
  // 先判断curvePath是否存在，如果存在就设置导弹飞行路径
  if(curvePath){
      // //设置导弹飞行路径
      missile.position.copy(curvePath.getPointAt(t));
    // 小于1才设置导弹飞行方向
    if(t+0.01 < 1){
    // // 设置导弹飞行方向
      missile.lookAt(curvePath.getPointAt(t+0.01));
    }

    // 导弹到达地面的时候才会有爆炸出现
    if(t>0.95){
      // 将精灵添加到场景中
      scene.add(sprite)
      // 判断sound是否播放，如果没有，那就播放
      if(!sound.isPlaying){
        sound.play();
      }
    }
  }

  //爆炸时间范围（0-10） 因为大概10s 完成一个爆炸的效果，所以范围设置0-10
  params.iTime.value = t * 10;

  // 渲染
  renderer.render(scene,camera)
  // 循环渲染
  requestAnimationFrame(render)
}
// 调用渲染函数
render()


// 创建精灵材质
let spriteMaterial = new THREE.SpriteMaterial({
  color:'#ffff00',
  transparent: true,
  blending:THREE.AdditiveBlending
})
// 添加一个sprite
let sprite = new THREE.Sprite(spriteMaterial)
// 设置精灵尺寸
// sprite.scale.set(0.5,0.5,0.5)
// 设置精灵位置
sprite.position.set(-5.5,0.8,0)
// 将精灵添加到场景中
// scene.add(sprite)


// 在onBeforeCompile函数中添加着色器代码
spriteMaterial.onBeforeCompile = function(shader){
  // 在着色器代码中添加着色器代码
  shader.vertexShader = shader.vertexShader.replace(
    // 设置 common
    "#include <common>",
    `
    #include <common>
    varying vec2 vUv;
    `
  )
  shader.vertexShader = shader.vertexShader.replace(
    // 设置vUv
    "#include <uv_vertex>",
    `
    #include <uv_vertex>
    vUv = uv;
    `
  )
  // 替换片元着色器
  shader.fragmentShader = fragmentShader
  // 添加uniform
  shader.uniforms.iResolution = {
    value: new THREE.Vector2(window.innerWidth,window.innerHeight),
  }
  shader.uniforms.iTime = params.iTime
  shader.uniforms.iMouse = {
    value:new THREE.Vector2(0,0)
  }
  shader.uniforms.iChannel0 = {
    // 加载纹理
    value: new THREE.TextureLoader().load("assets/iChannel0.png")
  }
  shader.uniforms.iChannel1 = {
    // 加载纹理
    value: new THREE.TextureLoader().load("assets/iChannel1.png")
  }
  shader.uniforms.iChannel2 = {
    // 加载纹理
    value: new THREE.TextureLoader().load("assets/iChannel2.png")
  }
}

<template>
  <div id="app">
    <div class="container" ref="container"></div>
  </div>
</template>
<script>
import * as THREE from 'three'
// 添加轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 加载hdr全景图，所需
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

export default {
  data () {
    return {
      camera: null,
      scene: null,
      renderer: null,
      cube: null
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
    // 初始化场景
      this.scene = new THREE.Scene()
      // 初始化相机（透视相机）
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      // // 设置相机位置
      // this.camera.position.set(0, 0, 5)
      // 也可以这么设置
      this.camera.position.z = 0.1

      // 初始化渲染器
      this.renderer = new THREE.WebGLRenderer()
      // 设置渲染器的大小
      this.renderer.setSize(window.innerWidth, window.innerHeight)

      // // 添加立方体
      // const geometry = new THREE.BoxGeometry(1, 1, 1) // 立方体，网格
      // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }) // 材质
      // this.cube = new THREE.Mesh(geometry, material) // 立方体+材质合成物体
      // this.scene.add(this.cube) // 添加到场景中

      // // 加载看房资源纹理图片
      // const geometry = new THREE.BoxGeometry(10, 10, 10) // 立方体，网格
      // // 4_b, 顺序： 左右上下前后
      // const arr = ['4_l', '4_r', '4_u', '4_d', '4_b', '4_f']
      // const boxMaterials = []

      // arr.forEach((item) => {
      //   // 纹理加载
      //   const texture = new THREE.TextureLoader().load(`./imgs/living/${item}.jpg`)
      //   // 创建材质
      //   // boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }))

      //   // 对纹理贴图进行旋转（上，下）
      //   if (item === '4_u' || item === '4_d') {
      //     // 旋转180
      //     texture.rotation = Math.PI
      //     // 设置旋转中心 几何体的中心
      //     texture.center = new THREE.Vector2(0.5, 0.5)
      //     boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }))
      //   } else {
      //     boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }))
      //   }
      // })
      // const cube = new THREE.Mesh(geometry, boxMaterials)
      // // 设置z轴反过来，就可以看到内部的东西了
      // cube.geometry.scale(1, 1, -1)
      // this.scene.add(cube)

      // 添加球 （加载全景图）
      const geometry = new THREE.SphereGeometry(5, 32, 32)
      // 创建加载hdr纹理图片loader
      const loader = new RGBELoader()
      loader.load('./imgs/hdr/Living.hdr', (texture) => {
        const material = new THREE.MeshBasicMaterial({ map: texture })
        const sphere = new THREE.Mesh(geometry, material)
        // 设置z轴反过来，就可以看到内部的东西了
        sphere.geometry.scale(1, 1, -1)
        this.scene.add(sphere)
      })

      // 添加轨道控制器
      const controls = new OrbitControls(this.camera, this.$refs.container)
      // 添加阻尼感，让鼠标炒作起来更真实
      controls.enableDamping = true

      // 挂载渲染器渲染出来的画布
      this.$refs.container.appendChild(this.renderer.domElement)
      // 挂载完毕后开始渲染
      this.render()
    },
    // 渲染函数
    render () {
      // 渲染场景
      this.renderer.render(this.scene, this.camera)
      requestAnimationFrame(this.render)
    }
  }
}
</script>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
.container {
  height: 100vh;
  width: 100vw;
  background-color: #f0f0f0;
}
</style>

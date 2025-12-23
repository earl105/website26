import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import gsap from 'gsap'

/* --------------------------------------------------
   BASIC SETUP
-------------------------------------------------- */

const scene = new THREE.Scene()
scene.background = new THREE.Color('#1e1e24')

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
)
camera.position.set(0, 1.6, 3)

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance'
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.physicallyCorrectLights = true
document.body.appendChild(renderer.domElement)

/* --------------------------------------------------
   LIGHTING
-------------------------------------------------- */

scene.add(new THREE.AmbientLight(0xffffff, 0.6))

const keyLight = new THREE.DirectionalLight(0xffffff, 1.2)
keyLight.position.set(5, 5, 5)
scene.add(keyLight)

const rimLight = new THREE.DirectionalLight(0xffffff, 0.6)
rimLight.position.set(-5, 3, -5)
scene.add(rimLight)

/* --------------------------------------------------
   CONTROLS
-------------------------------------------------- */

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.minDistance = 1.5
controls.maxDistance = 6
controls.target.set(0, 0.8, 0)
controls.update()

/* --------------------------------------------------
   MODEL LOADING
-------------------------------------------------- */

const loader = new GLTFLoader()

let laptop = null
let screen = null
let screenOpen = false

loader.load(
  '/models/laptop.glb', // <-- YOU handle this
  (gltf) => {
    laptop = gltf.scene
    laptop.position.set(0, 0, 0)
    laptop.scale.set(1, 1, 1)
    scene.add(laptop)

    // OPTIONAL: find parts by name (name them in Blender)
    screen = laptop.getObjectByName('Screen') || null

    // Improve material appearance
    laptop.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false
        child.receiveShadow = false
      }
    })
  },
  undefined,
  (error) => {
    console.error('Error loading model:', error)
  }
)

/* --------------------------------------------------
   INTERACTION (RAYCASTING)
-------------------------------------------------- */

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

window.addEventListener('click', (event) => {
  if (!laptop) return

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObjects(laptop.children, true)

  if (intersects.length === 0) return

  const clickedObject = intersects[0].object
  console.log('Clicked:', clickedObject.name)

  // Example interaction: open / close screen
  if (screen && clickedObject === screen || screen?.children.includes(clickedObject)) {
    toggleScreen()
  }
})

function toggleScreen() {
  if (!screen) return

  screenOpen = !screenOpen

  gsap.to(screen.rotation, {
    x: screenOpen ? -Math.PI / 2 : 0,
    duration: 1,
    ease: 'power2.out'
  })
}

/* --------------------------------------------------
   RESIZE HANDLING
-------------------------------------------------- */

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/* --------------------------------------------------
   ANIMATION LOOP
-------------------------------------------------- */

const clock = new THREE.Clock()

function animate() {
  const delta = clock.getDelta()

  controls.update()
  renderer.render(scene, camera)

  requestAnimationFrame(animate)
}

animate()

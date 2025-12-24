import { Canvas } from '@react-three/fiber'
import { OrbitControls, Center, Grid, Stats } from '@react-three/drei'
import { Suspense } from 'react'
import LaptopModel from './LaptopModel'

export default function LaptopScene() {
  return (
    <div style={{ width: '100%', height: '500px', border: '2px solid white' }}>
      <Canvas
  // Removed 'legacy' to allow WebGL 2 (standard)
  // Removed 'low-power' to give the GPU some room to breathe
  camera={{ position: [0, 1, 3], fov: 45 }}
  onCreated={({ gl }) => {
    gl.setClearColor('#1a1a20', 1)
  }}
>
  <ambientLight intensity={1.5} />
  <pointLight position={[10, 10, 10]} />
  
  <Suspense fallback={<mesh><boxGeometry /><meshBasicMaterial color="orange" /></mesh>}>
    <Center>
      <LaptopModel />
    </Center>
  </Suspense>

  <OrbitControls />
</Canvas>
    </div>
  )
}
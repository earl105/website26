import { Canvas } from '@react-three/fiber'
import { OrbitControls, Center } from '@react-three/drei'
import { Suspense } from 'react'
import LaptopModel from './LaptopModel'

export default function LaptopScene() {
  return (
    <div style={{ width: 320, height: 320 }}>
      <Canvas
        // 🔒 force safest renderer config
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'low-power',
          preserveDrawingBuffer: false,
        }}
        // 🔒 force WebGL1 (prevents Firefox crashes)
        legacy
        camera={{ position: [0, 1.6, 3], fov: 45 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0f0f14', 1)
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />

        <Suspense fallback={null}>
          <Center>
            <LaptopModel />
          </Center>
        </Suspense>

        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  )
}

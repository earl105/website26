//portfolio\src\components\LaptopScene.tsx

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Center, Environment, ContactShadows } from '@react-three/drei'
import { Suspense } from 'react'
import LaptopModel from './LaptopModel'

export default function LaptopScene() {
  return (
    <div style={{ width: '100%', height: '650px', background: 'var(--bg-alt)', position: 'relative' }}>
      <Canvas camera={{ position: [1.4, 0.5, 1.4], fov: 65 }} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        
        <Suspense fallback={null}>
          <Center>
            <group rotation={[0, Math.PI * 1.25, 0]}>
              <LaptopModel />
            </group>
          </Center>
          {/* Preset "city" or "apartment" usually matches GLTF viewers best */}
          <Environment preset="city" />
          {/* Adds a nice soft shadow under the laptop */}
          <ContactShadows position={[0, -0.25, 0]} opacity={0.4} scale={10} blur={2} far={1} />
        </Suspense>

        <OrbitControls makeDefault target={[0, -0.5, 0]} />
      </Canvas>
    </div>
  )
}
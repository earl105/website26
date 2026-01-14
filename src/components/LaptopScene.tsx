//portfolio\src\components\LaptopScene.tsx

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Center, Environment, ContactShadows } from '@react-three/drei'
import { Suspense, useEffect, useState, useRef } from 'react'
import LaptopModel from './LaptopModel'

export default function LaptopScene() {
  const [fov, setFov] = useState(65)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [visibleRatio, setVisibleRatio] = useState(1)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mql = window.matchMedia('(max-width: 768px)')

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const matches = 'matches' in e ? e.matches : mql.matches
      setIsMobile(matches)
      setFov(matches ? 80 : 65)
    }

    // initialize
    handleChange(mql)

    // add listener in a compatible way
    if ('addEventListener' in mql) {
      mql.addEventListener('change', handleChange as EventListener)
    } else {
      // older browsers
      // @ts-ignore - fallback for older lib typings
      mql.addListener(handleChange)
    }

    return () => {
      if ('removeEventListener' in mql) {
        mql.removeEventListener('change', handleChange as EventListener)
      } else {
        // @ts-ignore
        mql.removeListener(handleChange)
      }
    }
  }, [])

  // Track how much of the container is visible so we can drive the laptop "close" animation
  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setVisibleRatio(entry.intersectionRatio))
      },
      { threshold: Array.from({ length: 101 }, (_, i) => i / 100) }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '650px', background: 'var(--bg-alt)', position: 'relative' }}>
      <Canvas camera={{ position: [1.4, 0.5, 1.4], fov }} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        
        <Suspense fallback={null}>
          <group rotation={[0, Math.PI * 1.25, 0]} position={[0, isMobile ? 0.5 : 0, 0]}>
            <Center>
              <LaptopModel scrollProgress={1 - visibleRatio} />
            </Center>
          </group>
          {/* Preset "city" or "apartment" usually matches GLTF viewers best */}
          <Environment preset="city" />
          {/* Adds a nice soft shadow under the laptop */}
          <ContactShadows position={[0, -0.25, 0]} opacity={0.4} scale={10} blur={2} far={1} />
        </Suspense>

        <OrbitControls
          makeDefault
          target={[0, -0.5, 0]}
          enableZoom={false}
          enableRotate={false}
          enablePan={false}
        />
      </Canvas>
    </div>
  )
}
//LaptopModel.tsx
import { useGLTF } from '@react-three/drei'
import { useLayoutEffect } from 'react'
import { Mesh, MeshStandardMaterial } from 'three'

const laptopUrl = '/models/laptop.glb' 

export default function LaptopModel() {
  const { scene } = useGLTF(laptopUrl)

  // This ensures that even if the keys have tricky transparency, they render
  useLayoutEffect(() => {
    scene.traverse((obj) => {
      if (obj instanceof Mesh) {
        const applyToMat = (mat: MeshStandardMaterial) => {
          // Fixes potential "disappearing" keys due to transparency sorting
          mat.depthWrite = true
          mat.transparent = false // Try toggling this if keys are glass-like
  
          // Boost roughness if keys look too 'wet'
          if (obj.name.toLowerCase().includes('key')) {
            mat.roughness = 0.8
          }
        }
  
        const material = obj.material as MeshStandardMaterial | MeshStandardMaterial[]
        if (Array.isArray(material)) {
          material.forEach((m) => applyToMat(m))
        } else {
          applyToMat(material)
        }
      }
    })
  }, [scene])

  return (
    <primitive 
      object={scene} 
      scale={1.5} 
      position={[0, -0.5, 0]} 
    />
  )
}

useGLTF.preload(laptopUrl)
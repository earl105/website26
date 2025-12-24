import { useEffect, useRef, useState } from 'react'
import { Group, Bone, SkinnedMesh } from 'three'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import gsap from 'gsap'

// 1. Define the path as a simple string starting from the root /
const laptopUrl = '/models/Lowpoly_Notebook_3.glb' 

export default function LaptopModel() {
  // 2. useGLTF will now look in your 'public' folder for this path
  const { scene } = useGLTF(laptopUrl) as { scene: Group }

  const hingeBone = useRef<Bone | null>(null)
  const hingeRotation = useRef({ value: 0 }) // Wrapped in an object for GSAP
  const [open, setOpen] = useState(false)

  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as SkinnedMesh).isSkinnedMesh) {
        const skinned = obj as SkinnedMesh
        const bone = skinned.skeleton.bones.find(
          (b) => b.name === 'Hinge' || b.name.includes('Hinge')
        )
        if (bone) hingeBone.current = bone
      }
    })
  }, [scene])

  const toggleLid = (e: any) => {
    e.stopPropagation(); // Prevent event bubbling in R3F
    const next = !open
    setOpen(next)

    // GSAP works better on object properties
    gsap.to(hingeRotation.current, {
      value: next ? -Math.PI / 2 : 0,
      duration: 0.9,
      ease: 'power2.out',
    })
  }

  useFrame(() => {
    if (hingeBone.current) {
      // Apply the animated value to the bone
      hingeBone.current.rotation.x = hingeRotation.current.value 
      // Note: Check if your model uses rotation.x or rotation.y for the lid!
    }
  })

  return (
    <primitive
      object={scene}
      onClick={toggleLid}
      scale={0.5}
      position={[0, -0.25, 0]}
      rotation={[0, Math.PI, 0]}
    />
  )
}

// 3. Preload using the same string path
useGLTF.preload(laptopUrl)
import { useGLTF, Text } from '@react-three/drei'
import { useLayoutEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTypewriter } from '../hooks/useTypewriter'
import { Mesh, MeshStandardMaterial, Color, Group, MathUtils, Object3D } from 'three'

const laptopUrl = '/models/laptop.glb' 
const TARGET_MESH = 'Object_13'
const FONT_URL = '/fonts/JetBrainsMono-Regular.ttf'


type Props = {
  // 0 = fully open, 1 = fully closed
  scrollProgress?: number
}

export default function LaptopModel({ scrollProgress = 0 }: Props) {
  const { scene } = useGLTF(laptopUrl)
  const textGroupRef = useRef<Group>(null)
  // This will point to the screen mesh or a parent group (bezel/case) so the whole assembly rotates
  const screenMeshRef = useRef<Group | Mesh | null>(null)
  const baseRotationRef = useRef<number | null>(null)
  
  const typedText = useTypewriter('> Dylan Earl\n\n> Computer Science and Engineering\n\n> Student @ The Ohio State University', {
    speed: 100,
    deleteSpeed: 50,
    pauseDuration: 4000
  })

  //  Find and style the screen mesh
  useLayoutEffect(() => {
    const materialsToCleanup: MeshStandardMaterial[] = []

    scene.traverse((obj) => {
      if (obj instanceof Mesh && obj.name === TARGET_MESH) {
        // Clone material to break sharing
        const originalMat = obj.material as MeshStandardMaterial
        const screenMat = originalMat.clone()

        // Style as dark glass screen
        screenMat.color = new Color('#0a0a0f')
        screenMat.roughness = 0.15
        screenMat.metalness = 0.9
        screenMat.emissive = new Color('#000000')

        obj.material = screenMat
        materialsToCleanup.push(screenMat)
        obj.renderOrder = 10

        // Prefer rotating the parent group so bezel + case move with the screen.
        // Fallback to the mesh itself if no suitable parent exists.
        let rotTarget: Object3D | null = obj
        if (obj.parent && obj.parent.type !== 'Scene') {
          // climb one level to include bezel/case if present
          rotTarget = obj.parent
        }

        screenMeshRef.current = rotTarget as Group
        // store the current rotation.x as the neutral base
        baseRotationRef.current = rotTarget.rotation ? rotTarget.rotation.x : obj.rotation.x
      }
    })
    
    return () => {
      materialsToCleanup.forEach(mat => mat.dispose())
    }
  }, [scene])

  // Attach text group directly to screen mesh
  useLayoutEffect(() => {
    if (!screenMeshRef.current || !textGroupRef.current) return

    const screenMesh = screenMeshRef.current
    const textGroup = textGroupRef.current

    // Remove from scene and add to screen mesh (or its parent group)
    if (textGroup.parent) {
      textGroup.parent.remove(textGroup)
    }
    ;(screenMesh as Object3D).add(textGroup)

    // Adjust text placement relative to the new parent group
    textGroup.position.set(1.25, 0.09, -1.5)
    textGroup.rotation.set(-Math.PI / 2, Math.PI, 0)
  }, [scene])

  // Animate the screen mesh rotation based on scroll progress (smooth lerp).
  // Uses the model's base rotation so we get the full expected delta (~90deg),
  // and speeds up interpolation for snappier response to scrolling.
  useFrame(() => {
    const mesh = screenMeshRef.current
    const base = baseRotationRef.current
    if (!mesh || base === null) return


    const openAngle = base + MathUtils.degToRad(80) 
    const closedAngle = base + MathUtils.degToRad(-108) 

    // Base scroll progress (0..1)
    const t = MathUtils.clamp(scrollProgress, 0, 1)

    // Double the effective rotation for the same scroll amount, but clamp to physical limit
    const doubledT = MathUtils.clamp(t * 1.5, 0, 1)
    const target = openAngle + (closedAngle - openAngle) * doubledT

    // Make closing noticeably faster than opening for snappier feel
    const isClosing = target < mesh.rotation.x
    const lerpFactor = isClosing ? 0.6 : 0.18

    mesh.rotation.x = MathUtils.lerp(mesh.rotation.x, target, lerpFactor)

    // Enforce physical limits so the lid never rotates past fully open/closed positions
    mesh.rotation.x = MathUtils.clamp(mesh.rotation.x, closedAngle, openAngle)
  })

  return (
    <>
      <primitive 
        object={scene} 
        scale={1.5} 
        position={[0, -0.5, 0]} 
      />
      
      {/* Text group that will be reparented to screen mesh */}
      <group ref={textGroupRef}>
        <Text
          font={FONT_URL}
          fontSize={0.15}
          maxWidth={2.3}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign="left"
          anchorX="left"
          anchorY="top"
          renderOrder={11}
        >
          {typedText}
          <meshStandardMaterial 
            color="#4cb84b"
            emissive="#2b7229ff"
            emissiveIntensity={4}
            toneMapped={false}
          />
        </Text>
      </group>
    </>
  )
}

useGLTF.preload(laptopUrl)
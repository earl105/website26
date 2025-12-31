import { useGLTF, Text } from '@react-three/drei'
import { useLayoutEffect, useRef } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'
import { Mesh, MeshStandardMaterial, Color, Group } from 'three'

const laptopUrl = '/models/laptop.glb' 
const TARGET_MESH = 'Object_13'
const FONT_URL = '/fonts/JetBrainsMono-Regular.ttf'


export default function LaptopModel() {
  const { scene } = useGLTF(laptopUrl)
  const textGroupRef = useRef<Group>(null)
  const screenMeshRef = useRef<Mesh | null>(null)
  
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
        console.log('Found screen mesh:', obj.name)
        
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
        
        screenMeshRef.current = obj
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
    
    console.log('Attaching text group to screen mesh')
    
    // Remove from scene and add to screen mesh
    if (textGroup.parent) {
      textGroup.parent.remove(textGroup)
    }
    screenMesh.add(textGroup)
    
   
    textGroup.position.set(1.25, 0.09, -1.5) //left, offset from screen, up but inverse
    
  
  textGroup.rotation.set(-Math.PI / 2, Math.PI, 0)
    
    console.log('Text attached. Screen local position:', textGroup.position.toArray())
  }, [scene])

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
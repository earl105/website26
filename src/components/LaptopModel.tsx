import { useGLTF } from '@react-three/drei'
import { Group } from 'three'

const laptopUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb' 

export default function LaptopModel() {
  const { scene } = useGLTF(laptopUrl) as { scene: Group }

  return (
    <primitive 
      object={scene} 
      scale={1.5} 
      position={[0, -0.5, 0]} 
    />
  )
}
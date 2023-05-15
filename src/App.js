import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Hud, OrbitControls, OrthographicCamera, Environment } from '@react-three/drei'

export default function App() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <Torus scale={2} />
      <Viewcube />
      <OrbitControls />
      <Environment preset="city" />
    </Canvas>
  )
}

function Torus(props) {
  const [hovered, hover] = useState(false)
  return (
    <mesh onPointerOver={(e) => hover(true)} onPointerOut={(e) => hover(false)} {...props}>
      <torusGeometry args={[1, 0.25, 32, 100]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

function Viewcube({ renderPriority = 1, matrix = new THREE.Matrix4() }) {
  const mesh = useRef(null)
  const { camera } = useThree()
  const [hovered, hover] = useState(null)

  useFrame(() => {
    // Spin mesh to the inverse of the default cameras matrix
    matrix.copy(camera.matrix).invert()
    mesh.current.quaternion.setFromRotationMatrix(matrix)
  })

  return (
    <Hud renderPriority={renderPriority}>
      <OrthographicCamera makeDefault position={[0, 0, 100]} />
      <mesh
        ref={mesh}
        //position={[size.width / 2 - 120, size.height / 2 - 120, 0]}
        onPointerOut={(e) => hover(null)}
        onPointerMove={(e) => hover(e.face.materialIndex)}>
        {[...Array(6)].map((_, index) => (
          <meshLambertMaterial attach={`material-${index}`} key={index} color={hovered === index ? 'orange' : 'hotpink'} />
        ))}
        <boxGeometry args={[80, 80, 80]} />
      </mesh>
      <ambientLight intensity={1} />
      <pointLight position={[200, 200, 100]} intensity={0.5} />
    </Hud>
  )
}

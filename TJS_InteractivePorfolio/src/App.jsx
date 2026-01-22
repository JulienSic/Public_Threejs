import { Canvas, useFrame } from '@react-three/fiber'
import React, { useState } from 'react'
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js'
import { Vector3 } from 'three'
import { Quaternion } from 'three'

export default function App() {
  return (
    <div className="h-screen">
      <Canvas>
        
        <AnimatedBoxComponent />
        <ambientLight intensity={0.1} />
        <directionalLight position={[-5,5,5]} color={0xF5F0E6} name='mainLight'/>
        <directionalLight position={[5,-5,-5]} color={0x661D6E} name='shadowLight'/>
      </Canvas>

    </div>
  )
}

function AnimatedBoxComponent() {
  const [active, setActive] = useState(false)
  const [hovered, setHover] = useState(false)
  const [rotating, setRotation] = useState(false)
  const rotatingCube = React.useRef()

  const angle = 1;


  const targetRotationX = new Quaternion().setFromAxisAngle(new Vector3(1,0,0), angle);
  const targetRotationY = new Quaternion().setFromAxisAngle(new Vector3(0,1,0), angle);

  const handleClick = () => {
    setActive(!active);
    setRotation(!rotating);
  }
  useFrame(({clock}) => {
    const targetScale = hovered ? 1.5 : 1;
    const targetPositionX = active ? -2 : 0;
    const targetQuarternion = active ? targetRotationX : targetRotationY;

    rotatingCube.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.1);

    if (active) {
      rotatingCube.current.position.lerp(new Vector3(targetPositionX, 0, 0), 0.1);
      
      rotatingCube.current.quaternion.slerp(targetQuarternion, clock.elapsedTime);
    } else {
      rotatingCube.current.position.lerp(new Vector3(targetPositionX, 0, 0), 0.1);
    }
  })
  return ( 
    <mesh onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)} onClick={handleClick} ref={rotatingCube}>
      <boxGeometry args={[2,2,2]} />
      <meshStandardMaterial 
      color={0xF7EC4F} 
      roughness={0.6} 
      metalness={0.1} />
    </mesh>
  )
}

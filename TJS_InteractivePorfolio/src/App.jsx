import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import React, { useState } from 'react'
import { MathUtils, Vector3, Quaternion, TextureLoader } from 'three'
import {GLTFLoader} from "three/examples/jsm/Addons.js";


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
  const customModel = useLoader(GLTFLoader, '/assets/models/TJS_BasicShape.glb')

  const angle = React.useRef(0);
  const currentSpeed = React.useRef(0); 

  const rotationAxis = new Vector3(0, 1, 0);
  const tempQuaternion = new Quaternion();

  const wasRotating = React.useRef(false);
  const snapTargetQuaternion = React.useRef(new Quaternion());

  // const targetRotationX = new Quaternion().setFromAxisAngle(new Vector3(1,0,0), Math.PI / 2);
  // const targetRotationY = new Quaternion().setFromAxisAngle(new Vector3(0,1,0), Math.PI / 2);

  const handleClick = () => {
    setActive(!active);
    setRotation(!rotating);

    // Debug
    // console.log(active);
    // console.log(rotating);
  }
  useFrame(({clock}, delta) => {
    const targetScale = hovered ? 1.5 : 1;
    const targetPositionX = active ? -2 : 0;
    const targetSpeed = rotating ? 2 : 0;


    rotatingCube.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.1);

    currentSpeed.current = MathUtils.lerp(currentSpeed.current, targetSpeed, 0.1);
    angle.current = currentSpeed * delta;

    if (!rotating && wasRotating.current) {
      const currentQuaternion = rotatingCube.current.quaternion;

      const currentAngle = 2 * Math.atan2(currentQuaternion.y, currentQuaternion.w);

      const targetAngle = Math.round(currentAngle / (Math.PI / 2)) * (Math.PI / 2);

      snapTargetQuaternion.current.setFromAxisAngle(rotationAxis, targetAngle);
    }

    wasRotating.current = rotating;

    if (active) {
      rotatingCube.current.position.lerp(new Vector3(targetPositionX, 0, 0), 0.1);
      if (rotating || currentSpeed.current > 0.01) {

        const frameAngle = currentSpeed.current * delta;
        tempQuaternion.setFromAxisAngle(rotationAxis, frameAngle);
      
        rotatingCube.current.quaternion.premultiply(tempQuaternion);
      } 
    } else {
      rotatingCube.current.quaternion.slerp(snapTargetQuaternion.current, 0.1);
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

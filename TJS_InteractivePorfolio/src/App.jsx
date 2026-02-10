import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import React, {useMemo, useState} from 'react'
import { MathUtils, Vector3, Quaternion, TextureLoader } from 'three'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";


export default function App() {
  return (
    <div className="h-screen">
      <Canvas>
        
        <AnimatedModelComponent />
        <ambientLight intensity={0.1} />
        <directionalLight position={[-5,5,5]} color={0xF5F0E6} name='mainLight'/>
        <directionalLight position={[5,-5,-5]} color={0x661D6E} name='shadowLight'/>
      </Canvas>

    </div>
  )
}

function AnimatedModelComponent() {
  const customModel = useLoader(GLTFLoader, '/assets/models/TJS_BasicShape.glb')

  const customGeometry = useMemo(() => {
    let geometry = null;
    customModel.scene.traverse((child) => {
      if (child.isMesh && !geometry) {
        geometry = child.geometry;
      }
    });
    return geometry;
  }, [customModel])

  const [active, setActive] = useState(false);
  const [hovered, setHover] = useState(false);
  const [rotating, setRotation] = useState(false);
  const rotatingModel = React.useRef();
  
  const modelScale = 0.2;

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
    const targetScale = hovered ? modelScale * 1.5 : modelScale;
    const targetPositionX = active ? -2 : 0;
    const targetSpeed = rotating ? 2 : 0;


    rotatingModel.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.1);

    currentSpeed.current = MathUtils.lerp(currentSpeed.current, targetSpeed, 0.1);
    angle.current = currentSpeed * delta;

    if (!rotating && wasRotating.current) {
      const currentQuaternion = rotatingModel.current.quaternion;

      const currentAngle = 2 * Math.atan2(currentQuaternion.y, currentQuaternion.w);

      const targetAngle = Math.round(currentAngle / (Math.PI / 2)) * (Math.PI / 2);

      snapTargetQuaternion.current.setFromAxisAngle(rotationAxis, targetAngle);
    }

    wasRotating.current = rotating;

    if (active) {
      rotatingModel.current.position.lerp(new Vector3(targetPositionX, 0, 0), 0.1);
      if (rotating || currentSpeed.current > 0.01) {

        const frameAngle = currentSpeed.current * delta;
        tempQuaternion.setFromAxisAngle(rotationAxis, frameAngle);

        rotatingModel.current.quaternion.premultiply(tempQuaternion);
      } 
    } else {
      rotatingModel.current.quaternion.slerp(snapTargetQuaternion.current, 0.1);
      rotatingModel.current.position.lerp(new Vector3(targetPositionX, 0, 0), 0.1);
    }
  })

  if (!customGeometry) {
    console.warn("No geometry found in GLTFLoader");
    return (
        <mesh ref={rotatingModel} onClick={handleClick} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
    );
  }

  console.log("Geometry successfully loaded");

  return ( 
    <mesh
        geometry={customGeometry}
        scale={[modelScale, modelScale, modelScale]}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onClick={handleClick}
        ref={rotatingModel}>

      <meshStandardMaterial
      color={0xF7EC4F} 
      roughness={0.6} 
      metalness={0.1} />
    </mesh>
  )
}

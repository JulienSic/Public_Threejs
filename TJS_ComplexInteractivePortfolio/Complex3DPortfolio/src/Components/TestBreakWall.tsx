import { useLoader } from '@react-three/fiber'
import React, {useMemo} from 'react'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {Mesh} from "three";

export default function TestBreakWall() {
  const customModel = useLoader(GLTFLoader, '/assets/models/TJS_TestBreakWall.glb');
  const modelScale = 0.01;
  const breakWall = React.useRef();

  // Extract the geometry from the model
  const customMesh = useMemo(() => {

    let foundMesh: Mesh | null = null;

    const sceneClone = customModel.scene.clone(true);

    sceneClone.traverse((child) => {
      if (child instanceof Mesh && !foundMesh) {
        foundMesh = child;
        if (Array.isArray(foundMesh.material)) {
          foundMesh.material.forEach((material) => {
            material.side = 2;
          });
        } else {
          foundMesh.material.side = 2;
        }

        if (foundMesh.geometry) {
          foundMesh.geometry.computeBoundingSphere();
          foundMesh.geometry.computeVertexNormals();
        }
      }
    });
    return foundMesh;
  }, [customModel]);

  if (!customMesh) return null;

  return (
      <primitive
          object={customMesh}
          scale={[modelScale, modelScale, modelScale]}
          ref={breakWall}>
      </primitive>
  );
}

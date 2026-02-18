import {useFrame, useLoader} from '@react-three/fiber'
import React, {useEffect, useMemo, useRef, useState} from 'react'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {DoubleSide, Group, Mesh, MeshStandardMaterial} from "three";
import {Pane} from "tweakpane";
import gsap from 'gsap';
import {useHelper} from "@react-three/drei";
import {VertexNormalsHelper} from "three/examples/jsm/helpers/VertexNormalsHelper";

interface TestBreakWallProps {
  debug?: boolean;
}

export default function TestBreakWall({ debug = false }: TestBreakWallProps) {
  const customModel = useLoader(GLTFLoader, '/assets/models/TJS_TestBreakWall.glb');
  const modelScale = 0.3;

  // Setting up targets
  const groupRef = useRef<Group>(null);
  const [targetMesh, setTargetMesh] = useState<Mesh | null>(null);

  // Creating a stable ref to send to Helper
  const meshRef = useMemo(() => ({ current: targetMesh }), [targetMesh]);
  const helperInstanceRef = useHelper(debug && targetMesh ? meshRef : null, VertexNormalsHelper, 0.5, 'green');

  useFrame(() => {
    if (helperInstanceRef.current) {
      helperInstanceRef.current.update();
    }
  })

  const morphMeshesRef = useRef<Mesh[]>([]);

  // Extract the geometry from the model
  const customMesh = useMemo(() => {

    const sceneClone = customModel.scene.clone(true);

    morphMeshesRef.current = [];

    sceneClone.traverse((child) => {
      if (child.isMesh) {

        const applyColorToSubMeshes = (material) => {

          const matName = material.name.toLowerCase();
          material.side = DoubleSide;
          material.wireframe = debug;

          if (matName.includes('wall')) {
            material.color.set('#392FEB');
            material.wireframe = debug;
          }
          else if (matName.includes('inside')) {
            material.color.set('#EBDE07');
            material.wireframe = debug;
          }
          else {
            material.color.set('white');
            console.log("Unknown Material, setting default value");
          }
        };

        child.castShadow = true;
        child.receiveShadow = true;

        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {

            if (child.material[0] instanceof MeshStandardMaterial) {
              child.material[0].side = DoubleSide;
              child.material[0].color.set('#EBDE07');
            }

            // Slot 1
            if (child.material[1] instanceof MeshStandardMaterial) {
              child.material[1].side = DoubleSide;
              child.material[1].color.set('#392FEB');
            }

          });
        } else if (child.material instanceof MeshStandardMaterial) {
          child.material.side = DoubleSide;
          applyColorToSubMeshes(child.material);

          //child.material.color.set(57,47,235);
          //child.material.color.set(240,229,38);
        }

        // Checks if there is a Shapekey in the mesh
        if (child.morphTargetInfluences) {
          console.log(`Found Shape Keys for ${child.name}`, child.morphTargetDictionnary);
          // Store the reference of the mesh
          morphMeshesRef.current.push(child);
        }


      }
      if (child.geometry) {
        child.geometry.computeBoundingSphere();
        child.geometry.computeVertexNormals();
      }
    });
    return sceneClone;
  }, [customModel, debug]);

  console.log(customMesh);
  if (!customMesh) return null;


  // TWEAKPANE
  useEffect(() => {
    const pane = new Pane({ title: 'Test Break Wall' });

    const params = {
      explosion: 0,
    }

    pane.addBinding(params, 'explosion',   {min: 0, max: 1, step: 0.01})
        .on('change', (ev) => {
          morphMeshesRef.current.forEach((mesh) => {
            if (mesh.morphTargetInfluences) {
              mesh.morphTargetInfluences[0] = ev.value;
            }
          });
        })

    const btn = pane.addButton ({ title: 'Wall Explosion' });

    btn.on('click', () => {
      gsap.killTweensOf(params);
      gsap.to(params, {
        explosion: 1,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: () => {
          pane.refresh();

          morphMeshesRef.current.forEach((mesh) => {
            if (mesh.morphTargetInfluences) {
              mesh.morphTargetInfluences[0] = params.explosion;
            }
          });
        }
      })
    })

    const btnR = pane.addButton ({ title: 'Reset Explosion'});

    btnR.on('click', () => {
      gsap.killTweensOf(params);
      gsap.to(params, {
        explosion:0,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: () => {
          pane.refresh();

          morphMeshesRef.current.forEach((mesh) => {
            if (mesh.morphTargetInfluences) {
              mesh.morphTargetInfluences[0] = params.explosion;
            }
          });
        }
      })

    })
    return () => {
      pane.dispose();
    }
  }, []);

  useEffect(() => {
    if (!groupRef.current) return;

    let found: Mesh | null = null;
    groupRef.current.traverse((child) => {
      // Look for the main wall to attach the green lines to
      if ((child as Mesh).isMesh && !found && child.name.toLowerCase().includes('wall')) {
        found = child as Mesh;
      }
    });
    setTargetMesh(found);
  }, [customMesh]);

  return (
      <primitive
          object={customMesh}
          scale={[modelScale, modelScale, modelScale]}
          ref={groupRef}>
      </primitive>
  );
}

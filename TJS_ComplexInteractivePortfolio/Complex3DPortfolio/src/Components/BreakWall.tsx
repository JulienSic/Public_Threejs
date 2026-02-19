import {useLoader} from "@react-three/fiber";
import {useEffect, useMemo, useRef, useState} from "react";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DoubleSide, type Group, type Mesh, type MeshStandardMaterial} from "three";
import {useHelper} from "@react-three/drei";
import {VertexNormalsHelper} from "three/examples/jsm/helpers/VertexNormalsHelper";

interface BreakWallProps {
    debug?: boolean;
}

export default function BreakWall({ debug= false }: BreakWallProps) {
    // Importing from files
    const breakWallModel = useLoader(GLTFLoader, '/assets/models/TJS_BreakWallFull.glb');

    // DEBUG PARAMS
    const defaultWallColor = '#392FEB';
    const defaultInsideColor = '#EBDE07';
    const defaultColor = '#F0F0F0';


    // Creating refs
    const groupRef = useRef<Group>(null);
    const [targetMesh, setTargetMesh] = useState<Mesh | null>(null);
    const helperRef = useMemo(() => ({ current: targetMesh }), [targetMesh]);

    // Creating a stable ref to send to Helper
    useHelper(debug && targetMesh ? helperRef : null, VertexNormalsHelper, 0.5, 'green');
    const breakWallRef = useRef();

    const modelScale = 0.3;

    // Extract and store mesh Object properties
    const customMesh = useMemo(() => {
        const sceneClone = breakWallModel.scene.clone(true);

        // Extract file content
        sceneClone.traverse((child) => {

            // Failsafe, targeting mesh only
            if (child.isMesh) {

                // Function that apply material properties
                const applyMat = (mat: MeshStandardMaterial) => {

                    mat.side = DoubleSide;
                    mat.wireframe = debug;

                    // Case if multiple materials in mesh are nested in sub Meshes
                    const matName = mat.name.toLowerCase();

                    switch (true) {
                        case matName.includes('wall'):
                            mat.color.set(defaultWallColor);
                            break;
                        case matName.includes('inside'):
                            mat.color.set(defaultInsideColor);
                            break;
                        default:
                            mat.color.set(defaultColor)
                            break;
                    }

                    child.castShadow = true;
                    child.receiveShadow = true;

                    // Case if multiple materials contained in an Array
                    if (Array.isArray(child.material)) {
                        child.material.forEach((m) => applyMat(m as MeshStandardMaterial));
                    }

                    // Default behavior
                    else {
                        applyMat(child.material as MeshStandardMaterial);
                    }
                }

                if ((child as Mesh).geometry) {
                    (child as Mesh).geometry.computeBoundingSphere();
                    (child as Mesh).geometry.computeVertexNormals();
                }
            }
        })

        return sceneClone;
    }, [breakWallModel, debug]);


    // Helper related
    useEffect(() => {
        if (!groupRef.current) return;

        let found: Mesh | null = null;
        groupRef.current.traverse((child) => {
            if ((child as Mesh).isMesh && !found && child.name.toLowerCase().includes('wall')) {
                found = child as Mesh;
            }
        });
        setTargetMesh(found);
    }, [customMesh]);

    // DEBUG
    console.log(customMesh);
    console.log(breakWallModel)

    return (
        <primitive
            object={customMesh}
            scale={[modelScale, modelScale, modelScale]}
            ref={breakWallRef}
        >
        </primitive>
    )
}
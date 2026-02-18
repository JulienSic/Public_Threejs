import {useLoader} from "@react-three/fiber";
import {useMemo, useRef, useState} from "react";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import type {Group, Mesh} from "three";
import {useHelper} from "@react-three/drei";
import {VertexNormalsHelper} from "three/examples/jsm/helpers/VertexNormalsHelper";

interface BreakWallProps {
    debug?: boolean;
}

export default function BreakWall({ debug= false }: BreakWallProps) {
    // Importing from files
    const breakWallModel = useLoader(GLTFLoader, '/assets/models/TJS_BreakWallFull.glb');

    // Creating refs
    const groupRef = useRef<Group>(null);
    const [targetMesh, setTargetMesh] = useState<Mesh | null>(null);
    const helperRef = useMemo(() => ({ current: targetMesh }), [targetMesh]);

    // Creating a stable ref to send to Helper
    useHelper(debug && targetMesh ? helperRef : null, VertexNormalsHelper, 0.5, 'green')
    const breakWallRef = useRef();

    const modelScale = 0.01;

    // Extract the Geometry from the model
    const customMesh = useMemo(() => {

    })

    return (
        <primitive
            object={breakWallModel}
            scale={[modelScale, modelScale, modelScale]}
            ref={breakWallRef}
        >
        </primitive>
    )
}
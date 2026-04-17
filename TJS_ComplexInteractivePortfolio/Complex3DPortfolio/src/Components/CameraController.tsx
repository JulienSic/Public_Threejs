import {PerspectiveCamera} from "@react-three/drei";
import {useEffect, useRef} from "react";
import {useCameraStore} from "../store/useCameraStore.ts";
import {Vector3} from "three";


export default function CameraController() {
    const currentTarget = useCameraStore((state) => state.currentTarget);

    const cameraRef = useRef(null);

    const cameraMainPrePosition = new Vector3(0, 1.3, 2);
    const cameraMainPostPosition = new Vector3(0, 0.2, 6.5);


    useEffect(() => {
        if (!cameraRef.current) return;

        console.log("[DBG] Models.tsx/HandleClick | Cible Changée. Nouvelle Cible : " + currentTarget);
        switch (currentTarget) {
            case 'projects':
                // DEBUG
                // console.log("[DBG] Models.tsx/HandleClick | Cadrage Projets");
                break;
            case 'skills':
                // DEBUG
                // console.log("[DBG] Models.tsx/HandleClick | Cadrage Compétences");
                break;
            case 'resume':
                // DEBUG
                // console.log("[DBG] Models.tsx/HandleClick | Cadrage Introduction");
                break;
            case 'explode':
                // DEBUG
                // console.log("[DBG] Models.tsx/HandleClick | Cadrage Scène Post Explosion");

                cameraRef.current.position.copy(cameraMainPostPosition);
                break;
            case 'main':
                // DEBUG
                // console.log("[DBG] Models.tsx/HandleClick | Cadrage Scène Pre Explosion");

                cameraRef.current.position.copy(cameraMainPrePosition);
                break;
            default:
                // DEBUG
                // console.log("[DBG] Models.tsx/HandleClick | Cible Incorrect");
                break;
        }
    }, [currentTarget]);

    return (
        <PerspectiveCamera
            makeDefault
            ref={cameraRef}
            fov={75}
            near={0.1}
            far={1000}
            position={cameraMainPrePosition} />
    )
}
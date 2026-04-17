import {DoubleSide} from "three";
import {useCameraStore} from "../store/useCameraStore.ts";
import {useEffect} from "react";
import {useModelStore} from "../store/useModelStore.ts";
import {useAnimateStore} from "../store/useAnimateStore.ts";

export default function UIHandler() {
    const {setCurrentTarget, currentTarget} = useCameraStore();
    const {debug, uiDebug} = useModelStore();
    const {triggerExplosion, resetExplosion} = useAnimateStore();

    const projectsTriggerDefaultColor = '#ED864A';
    const projectsTriggerScale = 2;

    const skillsTriggerDefaultColor = '#6EF582';
    const skillsTriggerScale = 2;

    const aboutTriggerDefaultColor =  '#1F1BF6';
    const aboutTriggerScale = 2;

    const explodeTriggerDefaultColor = '#F5E72B';
    const explodeTriggerScale = 6;

    useEffect(() => {
        console.log("[DBG] UIHandler.tsx | Current target : ", currentTarget);
    }, [currentTarget]);

    return (
        <>
            <mesh
                visible={uiDebug}
                position={[1.1,1.5,4]}
                scale={projectsTriggerScale}
                onClick={(e) => {
                    e.stopPropagation();
                    setCurrentTarget('projects');

                    // DEBUG
                    // console.log("[DBG] UIHandler.tsx | Click intercepté");
                }}
            >
                <meshStandardMaterial
                    color={projectsTriggerDefaultColor}
                    side={DoubleSide}
                    wireframe={debug}
                    roughness={0.5}
                    metalness={0.1}
                />
                <planeGeometry />
            </mesh>
            <mesh
                visible={uiDebug}
                position={[1.1,-0.5,4]}
                scale={skillsTriggerScale}
                onClick={(e) => {
                    e.stopPropagation();
                    setCurrentTarget('skills');

                    // DEBUG
                    // console.log("[DBG] UIHandler.tsx | Click intercepté");
                }}
            >
                <meshStandardMaterial
                    color={skillsTriggerDefaultColor}
                    side={DoubleSide}
                    wireframe={debug}
                    roughness={0.5}
                    metalness={0.1}
                />
                <planeGeometry />
            </mesh>
            <mesh
                visible={uiDebug}
                position={[-1.1,1.5,4]}
                scale={aboutTriggerScale}
                onClick={(e) => {
                    e.stopPropagation();
                    setCurrentTarget('resume');

                    // DEBUG
                    // console.log("[DBG] UIHandler.tsx | Click intercepté");
                }}
            >
                <meshStandardMaterial
                    color={aboutTriggerDefaultColor}
                    side={DoubleSide}
                    wireframe={debug}
                    roughness={0.5}
                    metalness={0.1}
                />
                <planeGeometry />
            </mesh>
            <mesh
                visible={uiDebug}
                position={[0,0,0.5]}
                scale={explodeTriggerScale}
                onClick={(e) => {
                    e.stopPropagation();
                    triggerExplosion();
                    setCurrentTarget('explode');

                    // DEBUG
                    // console.log("[DBG] UIHandler.tsx | Click intercepté");
                }}
            >
                <meshStandardMaterial
                    color={explodeTriggerDefaultColor}
                    side={DoubleSide}
                    wireframe={debug}
                    roughness={0.5}
                    metalness={0.1}
                />
                <planeGeometry />
            </mesh>
        </>
    )
}
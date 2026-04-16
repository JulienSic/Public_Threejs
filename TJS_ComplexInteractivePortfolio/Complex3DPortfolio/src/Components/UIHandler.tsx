import {DoubleSide, MeshStandardMaterial} from "three";


interface UIHandlerProps {
    debug?: boolean;
    uiDebug?: boolean;
    onTriggerClick: (target: string) => void;
}

export default function UIHandler({ debug= false, uiDebug= false, onTriggerClick }: UIHandlerProps) {
    const projectsTriggerDefaultColor = '#ED864A';
    const projectsTriggerScale = 2;

    const skillsTriggerDefaultColor = '#6EF582';
    const skillsTriggerScale = 2;

    const aboutTriggerDefaultColor =  '#1F1BF6';
    const aboutTriggerScale = 2;

    const explodeTriggerDefaultColor = '#F5E72B';
    const explodeTriggerScale = 6;

    return (
        <>
            <mesh
                visible={uiDebug}
                position={[1.1,1.5,4]}
                scale={projectsTriggerScale}
                onClick={() => {
                    onTriggerClick('projects');
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
                onClick={() => {
                    onTriggerClick('skills');
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
                onClick={() => {
                    onTriggerClick('resume');
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
            <mesh
                visible={uiDebug}
                position={[0,0,0.5]}
                scale={explodeTriggerScale}
                onClick={() => {
                    onTriggerClick('resume');
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
        </>
    )
}
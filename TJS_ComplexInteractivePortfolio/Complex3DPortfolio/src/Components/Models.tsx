import TestBreakWall from "./TestBreakWall.tsx";
import { OrbitControls } from "@react-three/drei";


export function Scene() {


    return (
        <group>
            <OrbitControls />
            <TestBreakWall/>
            <ambientLight intensity={0.1} />
            <directionalLight position={[-5,5,5]} color={0xF5F0E6} name='mainLight'/>
            <directionalLight position={[5,-5,-5]} color={0x661D6E} name='shadowLight'/>
        </group>
    )
}

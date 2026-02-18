import { OrbitControls } from "@react-three/drei";
import TestBreakWall from "./TestBreakWall.tsx";
import BreakWall from "./BreakWall.tsx";
import {useEffect, useState} from "react";
import {Pane} from "tweakpane";


export function Scene() {
    const [currentModel, setCurrentModel] = useState('TestBreakWall');
    const [debugMode, setDebugMode] = useState(false);


    useEffect(() => {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '10px';
        container.style.left = '10px'; // Sticky Left
        container.style.zIndex = '9999'; // Ensure it's on top of Canvas
        container.style.width = '300px'; // Optional: fix width
        document.body.appendChild(container);

        const pane = new Pane({ title: 'Scene Manager', expanded: true, container: container });



        const params = {
            model: 'TestBreakWall',
            debug: false,
        }

        pane.addBinding(params, 'model', {
            options: {
                'Test Break Wall': 'TestBreakWall',
                'Break Wall': 'BreakWall',
                'Basic Shape': 'BasicShape',
            },
            label: 'Select Model'
        }).on('change', (ev) => {
            setCurrentModel(ev.value);
        });

        pane.addBinding(params, 'debug', {
            label: 'Debug Mode',
        }).on('change', (ev) => {
            setDebugMode(ev.value)
        });

        return () => {
            pane.dispose();
            document.body.removeChild(container);
        };
    }, []);

    return (
        <group>
            <OrbitControls />

            {currentModel === 'TestBreakWall' && (
                <TestBreakWall debug={debugMode} />
            )}

            {/*{currentModel === 'BreakWall' && (
                <BreakWall debug={debugMode} />
            )}*/}

            {currentModel === 'BasicShape' && (
                <mesh>
                    <boxGeometry />
                    <meshStandardMaterial color="orange" wireframe={debugMode} />
                </mesh>
            )}

            <ambientLight intensity={0.1} />
            <directionalLight position={[-5,5,5]} color={0xF5F0E6} name='mainLight'/>
            <directionalLight position={[5,-5,-5]} color={0x661D6E} name='shadowLight'/>
        </group>
    )


}

import {OrbitControls, PerspectiveCamera} from "@react-three/drei";
import TestBreakWall from "./TestBreakWall.tsx";
import BreakWall from "./BreakWall.tsx";
import CIP3D_ModelHandler from "./CIP3D_ModelHandler.tsx";
import {useCallback, useEffect, useState} from "react";
import {Pane} from "tweakpane";
import UIHandler from "./UIHandler.tsx";


export function Scene() {
    const [currentModel, setCurrentModel] = useState('CIP3DModelHandler');
    const [debugMode, setDebugMode] = useState(false);
    const [uiDebugMode, setUIDebugMode] = useState(false);
    const [adminMode, setAdminMode] = useState(true);

    const HandleClick = (target: string) => {
        console.log("[DBG] Models.tsx/HandleClick | Cible Changée. Nouvelle Cible : " + target);
        switch (target) {
            case 'projects':
                console.log("[DBG] Models.tsx/HandleClick | Cadrage Projets");
                break;
            case 'skills':
                console.log("[DBG] Models.tsx/HandleClick | Cadrage Compétences");
                break;
            case 'resume':
                console.log("[DBG] Models.tsx/HandleClick | Cadrage Introduction");
                break;
            case 'main':
                console.log("[DBG] Models.tsx/HandleClick | Cadrage Scène");
                break;
            default:
                console.log("[DBG] Models.tsx/HandleClick | Cible Incorrect");
        }
    }


    useEffect(() => {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '10px';
        container.style.left = '10px'; // Sticky Left
        container.style.zIndex = '9999'; // Ensure it's on top of Canvas
        container.style.width = '300px'; // Optional: fix width
        document.body.appendChild(container);

        const pane = new Pane({ title: 'Scene Manager', expanded: true, container: container });

        if (!adminMode) {
            return;
        }


        const params = {
            model: 'CIP3DModelHandler',
            debug: false,
            uiDebug: false,
        }

        pane.addBinding(params, 'model', {
            options: {
                'Test Break Wall': 'TestBreakWall',
                'Break Wall': 'BreakWall',
                'Basic Shape': 'BasicShape',
                'Portfolio Full': 'CIP3DModelHandler',
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

        pane.addBinding(params, 'uiDebug', {
            label: 'UI Debug Mode',
        }).on('change', (ev) => {
            setUIDebugMode(ev.value)
        });

        return () => {
            pane.dispose();
            document.body.removeChild(container);
        };
    }, [adminMode]);

    return (
        <group>
            {adminMode && (
                <OrbitControls />
            )}



            {currentModel === 'TestBreakWall' && (
                <TestBreakWall debug={debugMode} />
            )}

            {currentModel === 'BreakWall' && (
                <BreakWall debug={debugMode} />
            )}

            {currentModel === 'CIP3DModelHandler' && (
                <>
                    <UIHandler onTriggerClick={HandleClick} debug={debugMode} uiDebug={uiDebugMode} />
                    <CIP3D_ModelHandler debug={debugMode} />
                </>
            )}

            {currentModel === 'BasicShape' && (
                <mesh>
                    <boxGeometry />
                    <meshStandardMaterial color="orange" wireframe={debugMode} />
                </mesh>
            )}

            {!adminMode && (
                <PerspectiveCamera fov={75}  near={0.1} far={1000} position={[0, 0, 5]} />
            )}

            <ambientLight intensity={0.1} />
            <directionalLight position={[-5,5,5]} color={0xF5F0E6} name='mainLight'/>
            <directionalLight position={[5,-5,-5]} color={0x661D6E} name='shadowLight'/>
        </group>
    )


}

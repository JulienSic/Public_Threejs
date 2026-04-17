import {OrbitControls, PerspectiveCamera} from "@react-three/drei";
import TestBreakWall from "./TestBreakWall.tsx";
import BreakWall from "./BreakWall.tsx";
import CIP3D_ModelHandler from "./CIP3D_ModelHandler.tsx";
import {useCallback, useEffect, useState} from "react";
import {Pane} from "tweakpane";
import UIHandler from "./UIHandler.tsx";
import CameraController from "./CameraController.tsx";
import {useModelStore} from "../store/useModelStore.ts";


export function Scene() {

    const {currentModel, setCurrentModel, debug, setDebug, uiDebug, setUiDebug, isAdmin, setIsAdmin} = useModelStore();


    useEffect(() => {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '10px';
        container.style.left = '10px'; // Sticky Left
        container.style.zIndex = '9999'; // Ensure it's on top of Canvas
        container.style.width = '300px'; // Optional: fix width
        document.body.appendChild(container);



        if (isAdmin) {
            const pane = new Pane({ title: 'Scene Manager', expanded: true, container: container });

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
                setDebug(ev.value)
            });

            pane.addBinding(params, 'uiDebug', {
                label: 'UI Debug Mode',
            }).on('change', (ev) => {
                setUiDebug(ev.value)
            });

            return () => {
                pane.dispose();
                document.body.removeChild(container);
            };
        }



    }, [isAdmin]);

    return (
        <group>
            {isAdmin && (
                <OrbitControls />
            )}

            {currentModel === 'TestBreakWall' && (
                <TestBreakWall debug={debug} />
            )}

            {currentModel === 'BreakWall' && (
                <BreakWall debug={debug} />
            )}

            {currentModel === 'CIP3DModelHandler' && (
                <>
                    <UIHandler />
                    <CIP3D_ModelHandler />
                </>
            )}

            {currentModel === 'BasicShape' && (
                <mesh>
                    <boxGeometry />
                    <meshStandardMaterial color="orange" wireframe={debug} />
                </mesh>
            )}

            {!isAdmin && (
                <CameraController/>
            )}

            <ambientLight intensity={0.1} />
            <directionalLight position={[-5,5,5]} color={0xF5F0E6} name='mainLight'/>
            <directionalLight position={[5,-5,-5]} color={0x661D6E} name='shadowLight'/>
        </group>
    )


}

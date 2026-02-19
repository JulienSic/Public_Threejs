import {useFrame, useLoader} from "@react-three/fiber";
import {useEffect, useMemo, useRef, useState} from "react";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DoubleSide, Group, Mesh, MeshStandardMaterial} from "three";
import {useHelper} from "@react-three/drei";
import {VertexNormalsHelper} from "three/examples/jsm/helpers/VertexNormalsHelper";
import {Pane} from "tweakpane";
import gsap from "gsap";

interface BreakWallProps {
    debug?: boolean;
}

export default function BreakWall({ debug= false }: BreakWallProps) {
    // Importing from files
    const breakWallModel = useLoader(GLTFLoader, '/assets/models/TJS_BreakWallFull.glb');

    // Model Params
    const modelScale = 0.3;


    // DEBUG PARAMS
    const defaultWallColor = '#392FEB';
    const defaultInsideColor = '#EBDE07';
    const defaultColor = '#F0F0F0';

    // Creating refs
    const groupRef = useRef<Group>(null);
    const [targetMesh, setTargetMesh] = useState<Mesh | null>(null);
    const helperRef = useMemo(() => ({ current: targetMesh }), [targetMesh]);
    const movingWallPieces = useRef<Mesh[]>([]);

    // Creating a stable ref to send to Helper
    const helperInstanceRef = useHelper(debug && targetMesh ? helperRef : null, VertexNormalsHelper, 0.5, 'green');

    const morphMeshesRef = useRef<Mesh[]>([]);

    useFrame(({ clock }) => {
        if (helperInstanceRef.current) {
            helperInstanceRef.current.update();
        }

        const t = clock.getElapsedTime();


        // Moving Pieces
        /*movingWallPieces.current.forEach((piece, i) => {
            piece.position.z += Math.sin(t * 2 + i) *0.02;
        })*/
    })

    // Extract and store mesh Object properties
    const customMesh = useMemo(() => {
        const sceneClone = breakWallModel.scene.clone(true);

        morphMeshesRef.current = [];
        movingWallPieces.current = [];

        // Extract file content
        sceneClone.traverse((child) => {

            // DEBUG
            // console.log("Found Object:", child.name);


            // Filling the Array with meshes
            if (child.name.toLowerCase().includes('moving')) {
                // DEBUG
                // console.log("✅ Captured Moving Piece:", child.name);
                movingWallPieces.current.push(child);
            }

            // Failsafe, targeting mesh only
            if ((child as Mesh).isMesh) {

                child.castShadow = true;
                child.receiveShadow = true;

                // Function that apply material properties
                const applyMat = (mat: MeshStandardMaterial) => {
                    // Case if multiple materials in mesh are nested in sub Meshes
                    const matName = mat.name.toLowerCase();

                    // DEBUG
                    //console.log(`Found Material: "${mat.name}"`);

                    const newMat = new MeshStandardMaterial({
                        side: DoubleSide,
                        wireframe: debug,
                        roughness: 0.5,
                        metalness: 0.1,
                    });

                    switch (true) {
                        case matName.includes('wall'):
                            newMat.color.set(defaultWallColor);
                            break;
                        case matName.includes('inside'):
                            newMat.color.set(defaultInsideColor);
                            break;
                        default:
                            newMat.color.set(defaultColor)
                            break;
                    }

                    return newMat

                }

                // Case if multiple materials contained in an Array
                if (Array.isArray(child.material)) {
                    child.material = child.material.map((m) => applyMat(m as MeshStandardMaterial));
                }

                // Default behavior
                else {
                    child.material = applyMat(child.material as MeshStandardMaterial);
                }

                // Checks if there is a Shapekey in the mesh
                if (child.morphTargetInfluences) {
                    // DEBUG
                    // console.log(`Found Shape Keys for ${child.name}`, child.morphTargetDictionnary);

                    // Store the reference of the mesh
                    morphMeshesRef.current.push(child);
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
    // console.log(customMesh);
    // console.log(breakWallModel)

    // TWEAKPANE
    useEffect(() => {
        const pane = new Pane({ title: 'Break Wall' });

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

    return (
        <primitive
            object={customMesh}
            scale={[modelScale, modelScale, modelScale]}
            ref={groupRef}
        >
        </primitive>
    )
}
import {useFrame, useLoader} from "@react-three/fiber";
import {useEffect, useMemo, useRef, useState} from "react";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DoubleSide, Group, Mesh, MeshStandardMaterial, Vector3} from "three";
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

    const animState = useRef({ explosion: 0});

    // Custom pieces refs
    const experiencesPieceRef = useRef<Mesh | null>(null);
    const experiencesPieceInitPosRef = useRef<Vector3>(new Vector3());
    const experiencesPieceTargetPosRef = useRef<Vector3>(new Vector3());

    const projectsPieceRef = useRef<Mesh | null>(null);
    const projectsPieceInitPosRef = useRef<Vector3>(new Vector3());
    const projectsPieceTargetPosRef = useRef<Vector3>(new Vector3());

    const skillsPieceRef = useRef<Mesh | null>(null);
    const skillsPieceInitPosRef = useRef<Vector3>(new Vector3());
    const skillsPieceTargetPosRef = useRef<Vector3>(new Vector3());

    const middlePieceRef = useRef<Mesh | null>(null);
    const middlePieceInitPosRef = useRef<Vector3>(new Vector3());
    const middlePieceTargetPosRef = useRef<Vector3>(new Vector3());

    const smallRotating01PieceRef = useRef<Mesh | null>(null);
    const smallRotating01PieceInitPosRef = useRef<Vector3>(new Vector3());
    const smallRotating01PieceTargetPosRef = useRef<Vector3>(new Vector3());

    const smallRotating02PieceRef = useRef<Mesh | null>(null);
    const smallRotating02PieceInitPosRef = useRef<Vector3>(new Vector3());
    const smallRotating02PieceTargetPosRef = useRef<Vector3>(new Vector3());

    const smallRotating03PieceRef = useRef<Mesh | null>(null);
    const smallRotating03PieceInitPosRef = useRef<Vector3>(new Vector3());
    const smallRotating03PieceTargetPosRef = useRef<Vector3>(new Vector3());

    const smallRotating04PieceRef = useRef<Mesh | null>(null);
    const smallRotating04PieceInitPosRef = useRef<Vector3>(new Vector3());
    const smallRotating04PieceTargetPosRef = useRef<Vector3>(new Vector3());

    const smallRotating05PieceRef = useRef<Mesh | null>(null);
    const smallRotating05PieceInitPosRef = useRef<Vector3>(new Vector3());
    const smallRotating05PieceTargetPosRef = useRef<Vector3>(new Vector3());

    // Creating a stable ref to send to Helper
    const helperInstanceRef = useHelper(debug && targetMesh ? helperRef : null, VertexNormalsHelper, 0.5, 'green');

    const morphMeshesRef = useRef<Mesh[]>([]);

    useFrame(({}) => {
        if (helperInstanceRef.current) {
            helperInstanceRef.current.update();
        }

        const animationProgress = animState.current.explosion;

        // Animate Pieces
        morphMeshesRef.current.forEach((mesh) => {
            if (mesh.morphTargetInfluences) {
                mesh.morphTargetInfluences[0] = animationProgress;
            }
        });

        if (experiencesPieceRef.current) {
            experiencesPieceRef.current.position.lerpVectors(
                experiencesPieceInitPosRef.current,
                experiencesPieceTargetPosRef.current,
                animationProgress
            );
        }

        if (projectsPieceRef.current) {
            projectsPieceRef.current.position.lerpVectors(
                projectsPieceInitPosRef.current,
                projectsPieceTargetPosRef.current,
                animationProgress
            );
        }

        if (skillsPieceRef.current) {
            skillsPieceRef.current.position.lerpVectors(
                skillsPieceInitPosRef.current,
                skillsPieceTargetPosRef.current,
                animationProgress
            );
        }

        if (middlePieceRef.current) {
            middlePieceRef.current.position.lerpVectors(
                middlePieceInitPosRef.current,
                middlePieceTargetPosRef.current,
                animationProgress
            );
        }

        if (smallRotating01PieceRef.current) {
            smallRotating01PieceRef.current.position.lerpVectors(
                smallRotating01PieceInitPosRef.current,
                smallRotating01PieceTargetPosRef.current,
                animationProgress
            );
        }

        if (smallRotating02PieceRef.current) {
            smallRotating02PieceRef.current.position.lerpVectors(
                smallRotating02PieceInitPosRef.current,
                smallRotating02PieceTargetPosRef.current,
                animationProgress
            );
        }

        if (smallRotating03PieceRef.current) {
            smallRotating03PieceRef.current.position.lerpVectors(
                smallRotating03PieceInitPosRef.current,
                smallRotating03PieceTargetPosRef.current,
                animationProgress
            );
        }

        if (smallRotating04PieceRef.current) {
            smallRotating04PieceRef.current.position.lerpVectors(
                smallRotating04PieceInitPosRef.current,
                smallRotating04PieceTargetPosRef.current,
                animationProgress
            );
        }

        if (smallRotating05PieceRef.current) {
            smallRotating05PieceRef.current.position.lerpVectors(
                smallRotating05PieceInitPosRef.current,
                smallRotating05PieceTargetPosRef.current,
                animationProgress
            );
        }
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
                console.log("✅ Captured Moving Piece:", child.name);
                movingWallPieces.current.push(child as Mesh);
            }

            if (child.name === "Wall_Moving_Cell_05") {
                console.log("Found Experiences Piece", child.name);
                experiencesPieceRef.current = child as Mesh;
                experiencesPieceInitPosRef.current.copy(child.position);
                experiencesPieceTargetPosRef.current.copy(child.position).add(new Vector3(-0.5,1,6));
            }

            if (child.name === "Wall_Moving_Cell_07") {
                console.log("Found Projects Piece", child.name);
                projectsPieceRef.current = child as Mesh;
                projectsPieceInitPosRef.current.copy(child.position);
                projectsPieceTargetPosRef.current.copy(child.position).add(new Vector3(1.5,1,7));
            }

            if (child.name === "Wall_Moving_Cell_09") {
                console.log("Found Skills Piece", child.name);
                skillsPieceRef.current = child as Mesh;
                skillsPieceInitPosRef.current.copy(child.position);
                skillsPieceTargetPosRef.current.copy(child.position).add(new Vector3(1,1,4));
            }

            if (child.name === "Wall_Moving_Cell_06") {
                console.log("Found Middle Piece", child.name);
                middlePieceRef.current = child as Mesh;
                middlePieceInitPosRef.current.copy(child.position);
                middlePieceTargetPosRef.current.copy(child.position).add(new Vector3(1,1,10));
            }

            if (child.name === "Wall_Moving_Cell_12") {
                console.log("Found a matching Piece", child.name);
                smallRotating01PieceRef.current = child as Mesh;
                smallRotating01PieceInitPosRef.current.copy(child.position);
                smallRotating01PieceTargetPosRef.current.copy(child.position).add(new Vector3(-1.5,1,8));
            }

            if (child.name === "Wall_Moving_Cell_13") {
                console.log("Found a matching Piece", child.name);
                smallRotating02PieceRef.current = child as Mesh;
                smallRotating02PieceInitPosRef.current.copy(child.position);
                smallRotating02PieceTargetPosRef.current.copy(child.position).add(new Vector3(1,-1,9));
            }

            if (child.name === "Wall_Moving_Cell_10") {
                console.log("Found a matching Piece", child.name);
                smallRotating03PieceRef.current = child as Mesh;
                smallRotating03PieceInitPosRef.current.copy(child.position);
                smallRotating03PieceTargetPosRef.current.copy(child.position).add(new Vector3(1,0,9));
            }

            if (child.name === "Wall_Moving_Cell_14") {
                console.log("Found a matching Piece", child.name);
                smallRotating04PieceRef.current = child as Mesh;
                smallRotating04PieceInitPosRef.current.copy(child.position);
                smallRotating04PieceTargetPosRef.current.copy(child.position).add(new Vector3(1,1,13));
            }

            if (child.name === "Wall_Moving_Cell_15") {
                console.log("Found a matching Piece", child.name);
                smallRotating05PieceRef.current = child as Mesh;
                smallRotating05PieceInitPosRef.current.copy(child.position);
                smallRotating05PieceTargetPosRef.current.copy(child.position).add(new Vector3(1,1,11));
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

        pane.addBinding(animState.current, 'explosion',   {min: 0, max: 1, step: 0.01});

        const btn = pane.addButton ({ title: 'Wall Explosion' });

        btn.on('click', () => {
            gsap.killTweensOf(animState.current);
            gsap.to(animState.current, {
                explosion: 1,
                duration: 1.5,
                ease: "power2.out",
                onUpdate: () => pane.refresh()
            })
        })

        const btnR = pane.addButton ({ title: 'Reset Explosion'});

        btnR.on('click', () => {
            gsap.killTweensOf(animState.current);
            gsap.to(animState.current, {
                explosion:0,
                duration: 0.5,
                ease: "power2.out",
                onUpdate: () => pane.refresh()
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
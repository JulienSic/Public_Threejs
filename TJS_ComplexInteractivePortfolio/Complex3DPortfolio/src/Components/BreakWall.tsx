import {useFrame, useLoader} from "@react-three/fiber";
import {useEffect, useMemo, useRef, useState} from "react";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DoubleSide, Group, Mesh, MeshStandardMaterial, Quaternion, Vector3, Object3D, Euler, MathUtils} from "three";
import {useHelper} from "@react-three/drei";
import {VertexNormalsHelper} from "three/examples/jsm/helpers/VertexNormalsHelper";
import {Pane} from "tweakpane";
import gsap from "gsap";

interface BreakWallProps {
    debug?: boolean;
}

interface AnimatedPiece {
    target: Object3D;
    initPos: Vector3;
    targetPos: Vector3;
    initRot: Quaternion;
    targetRot: Quaternion;
    initEuler: Euler;
    targetEuler: Euler;
    useEuler: boolean;
    continuousSpin?: Vector3;
    currentSpeed?: Vector3;
}

const PIECE_CONFIGS = [
    { name: "Wall_Moving_Cell_05", posOffset: new Vector3(-0.5,1,6), rotOffset: new Euler(MathUtils.degToRad(9), MathUtils.degToRad(-62), MathUtils.degToRad(-0)) },
    { name: "Wall_Moving_Cell_07", posOffset: new Vector3(1.5,1,7), rotOffset: new Euler(MathUtils.degToRad(-20), MathUtils.degToRad(78), MathUtils.degToRad(-0)) },
    { name: "Wall_Moving_Cell_09", posOffset: new Vector3(1,-3,5), rotOffset: new Euler(MathUtils.degToRad(20), MathUtils.degToRad(73), MathUtils.degToRad(-0)) },
    { name: "Wall_Moving_Cell_06", posOffset: new Vector3(1,1,13), rotOffset: new Euler(MathUtils.degToRad(0), MathUtils.degToRad(-217), MathUtils.degToRad(-92)) },
    { name: "Wall_Moving_Cell_12", posOffset: new Vector3(-1.5,1,8), rotOffset: new Euler(MathUtils.degToRad(-34), MathUtils.degToRad(-439), MathUtils.degToRad(-0)), useEuler: true },
    { name: "Wall_Moving_Cell_13", posOffset: new Vector3(1,-1,12), rotOffset: new Euler(MathUtils.degToRad(11), MathUtils.degToRad(2), MathUtils.degToRad(96)) },
    { name: "Wall_Moving_Cell_10", posOffset: new Vector3(1,0,15), rotOffset: new Euler(MathUtils.degToRad(23), MathUtils.degToRad(-295), MathUtils.degToRad(247)), useEuler: true },
    { name: "Wall_Moving_Cell_14", posOffset: new Vector3(1,1,16),rotOffset: new Euler(0,0,0) , continuousSpin: new Vector3(MathUtils.degToRad(7), MathUtils.degToRad(-57), MathUtils.degToRad(360))},
    { name: "Wall_Moving_Cell_15", posOffset: new Vector3(1,1,11), rotOffset: new Euler(MathUtils.degToRad(12), MathUtils.degToRad(67), MathUtils.degToRad(20)) }
]

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

    const animState = useRef({ explosion: 0, isClosing: false });

    // Creating a stable ref to send to Helper
    const helperInstanceRef = useHelper(debug && targetMesh ? helperRef : null, VertexNormalsHelper, 0.5, 'green');

    const morphMeshesRef = useRef<Mesh[]>([]);
    const movingWallPieces = useRef<Mesh[]>([]);
    const animatedPiecesRef = useRef<AnimatedPiece[]>([]);

    useFrame((_state, delta) => {
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

        animatedPiecesRef.current.forEach((piece) => {
            piece.target.position.lerpVectors(piece.initPos, piece.targetPos, animationProgress);

            if (piece.continuousSpin && piece.currentSpeed) {

                if (animState.current.isClosing || animationProgress < 0.01) {
                    piece.target.quaternion.slerp(piece.initRot, 20 * delta);

                } else {
                    const targetSpeed = piece.continuousSpin;

                    piece.currentSpeed.lerp(targetSpeed, 3 * delta);

                    piece.target.rotateX(piece.currentSpeed.x * delta);
                    piece.target.rotateY(piece.currentSpeed.y * delta);
                    piece.target.rotateZ(piece.currentSpeed.z * delta);

                }
            } else if (piece.useEuler) {

                // Euler Spin Method
                const newX = MathUtils.lerp(piece.initEuler.x, piece.targetEuler.x, animationProgress);
                const newY = MathUtils.lerp(piece.initEuler.y, piece.targetEuler.y, animationProgress);
                const newZ = MathUtils.lerp(piece.initEuler.z, piece.targetEuler.z, animationProgress);
                piece.target.rotation.set(newX, newY, newZ);
            } else {

                // Quaternion Spin method
                piece.target.quaternion.slerpQuaternions(piece.initRot, piece.targetRot, animationProgress);
            }

        })
    })

    // Extract and store mesh Object properties
    const customMesh = useMemo(() => {
        const sceneClone = breakWallModel.scene.clone(true);

        morphMeshesRef.current = [];
        movingWallPieces.current = [];
        animatedPiecesRef.current = [];

        const configMap = new Map(PIECE_CONFIGS.map(c => [c.name, c]));

        // Extract file content
        sceneClone.traverse((child) => {
            // DEBUG
            // console.log("Found Object:", child.name);

            if (child.name.toLowerCase().includes("moving")) {
                movingWallPieces.current.push(child);
            }

            const config = configMap.get(child.name);
            if (config) {

                // DEBUG
                // console.log(`🌟 Configured Special Piece: ${child.name}`);

                const initPos = new Vector3().copy(child.position);
                const targetPos = new Vector3().copy(child.position).add(config.posOffset);

                // Quaternion
                const initRot = new Quaternion().copy(child.quaternion);
                const offsetQuat = new Quaternion().setFromEuler(config.rotOffset)
                const targetRot = new Quaternion().copy(child.quaternion).multiply(offsetQuat);

                // Euler
                const initEuler = new Euler().copy(child.rotation);
                const targetEuler = new Euler(
                    initEuler.x + config.rotOffset.x,
                    initEuler.y + config.rotOffset.y,
                    initEuler.z + config.rotOffset.z,
                );

                animatedPiecesRef.current.push({
                    target: child,
                    initPos: initPos,
                    targetPos: targetPos,
                    initRot: initRot,
                    targetRot: targetRot,
                    initEuler: initEuler,
                    targetEuler: targetEuler,
                    useEuler: !!config.useEuler,
                    continuousSpin: config.continuousSpin,
                    currentSpeed: config.continuousSpin ? new Vector3(0,0,0) : undefined
                });
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


        pane.addBinding(animState.current, 'explosion',   {min: 0, max: 1, step: 0.01});

        const btn = pane.addButton ({ title: 'Wall Explosion' });

        const windUpSpins = () => {
            animatedPiecesRef.current.forEach((piece) => {

                if (piece.continuousSpin && piece.currentSpeed) {
                    piece.currentSpeed.copy(piece.continuousSpin).multiplyScalar(8);
                }
            });
        };

        const resetSpins = () => {
            animatedPiecesRef.current.forEach((piece) => {
                if (piece.continuousSpin && piece.currentSpeed) {
                    piece.currentSpeed.set(0,0,0);
                }
            });
        }

        btn.on('click', () => {
            windUpSpins()
            animState.current.isClosing = false;
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
            resetSpins()
            animState.current.isClosing = true;
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
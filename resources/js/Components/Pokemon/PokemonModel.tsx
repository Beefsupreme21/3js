import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, Suspense, useEffect, useMemo } from 'react';
import { Group, AnimationMixer, Vector3 } from 'three';

interface PokemonModelProps {
    url: string;
    position: [number, number, number];
    scale?: number;
}

function Model({ url, position, scale = 1 }: PokemonModelProps) {
    const { scene, animations } = useGLTF(url);
    const groupRef = useRef<Group>(null);
    const mixerRef = useRef<AnimationMixer | null>(null);
    const velocityRef = useRef(new Vector3(0, 0, 0));
    const spawnPositionRef = useRef(new Vector3(position[0], position[1], position[2]));
    const targetRef = useRef(new Vector3(position[0], position[1], position[2]));
    const speedRef = useRef(0.5 + Math.random() * 0.5); // Random speed per Pokemon
    const idleActionRef = useRef<any>(null);
    const walkActionRef = useRef<any>(null);
    const isMovingRef = useRef(false);

    // Clone scene for this instance - must clone to allow multiple instances
    const clonedScene = useMemo(() => {
        if (!scene) return null;
        return scene.clone();
    }, [scene]);
    
    // Ensure position is set correctly
    useEffect(() => {
        if (groupRef.current) {
            spawnPositionRef.current.set(position[0], position[1], position[2]);
            groupRef.current.position.set(position[0], position[1], position[2]);
            targetRef.current.set(position[0], position[1], position[2]);
        }
    }, [position]);
    
    // Initialize mixer and set up animations when scene is ready
    useEffect(() => {
        if (clonedScene && animations && animations.length > 0) {
            mixerRef.current = new AnimationMixer(clonedScene);
            
            // Try to find idle or walking animation
            const idleAnim = animations.find(anim => 
                anim.name.toLowerCase().includes('idle') || 
                anim.name.toLowerCase().includes('wait') ||
                anim.name.toLowerCase().includes('stand')
            );
            const walkAnim = animations.find(anim => 
                anim.name.toLowerCase().includes('walk') || 
                anim.name.toLowerCase().includes('run') ||
                anim.name.toLowerCase().includes('move')
            );

            // Set up idle animation
            if (idleAnim && mixerRef.current) {
                idleActionRef.current = mixerRef.current.clipAction(idleAnim);
                idleActionRef.current.play();
            } else if (animations[0] && mixerRef.current) {
                // Fallback to first animation
                idleActionRef.current = mixerRef.current.clipAction(animations[0]);
                idleActionRef.current.play();
            }

            // Set up walk animation
            if (walkAnim && mixerRef.current) {
                walkActionRef.current = mixerRef.current.clipAction(walkAnim);
                walkActionRef.current.setLoop(2); // Loop
            }
        }
    }, [animations, clonedScene]);

    // Animation and movement
    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // Update animation mixer
        if (mixerRef.current) {
            mixerRef.current.update(delta);
        }

        const currentPos = groupRef.current.position;
        const target = targetRef.current;
        const distance = currentPos.distanceTo(target);

        // If reached target, pick a new random target
        if (distance < 0.5) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 3 + Math.random() * 5;
            const spawnPos = spawnPositionRef.current;
            target.set(
                spawnPos.x + Math.cos(angle) * radius,
                spawnPos.y,
                spawnPos.z + Math.sin(angle) * radius
            );
        }

        // Move towards target
        const isMoving = distance > 0.1;
        if (isMoving) {
            const direction = target.clone().sub(currentPos).normalize();
            velocityRef.current.lerp(direction.multiplyScalar(speedRef.current), 0.1);
            currentPos.add(velocityRef.current.clone().multiplyScalar(delta));
            
            // Rotate to face movement direction
            if (velocityRef.current.length() > 0.01) {
                const targetRotation = Math.atan2(velocityRef.current.x, velocityRef.current.z);
                groupRef.current.rotation.y = targetRotation;
            }
            
            // Switch to walk animation if moving
            if (!isMovingRef.current) {
                isMovingRef.current = true;
                if (idleActionRef.current) idleActionRef.current.fadeOut(0.2);
                if (walkActionRef.current) {
                    walkActionRef.current.reset().fadeIn(0.2).play();
                }
            }
        } else {
            // Stop moving
            velocityRef.current.lerp(new Vector3(0, 0, 0), 0.2);
            
            // Switch to idle animation if stopped
            if (isMovingRef.current) {
                isMovingRef.current = false;
                if (walkActionRef.current) walkActionRef.current.fadeOut(0.2);
                if (idleActionRef.current) {
                    idleActionRef.current.reset().fadeIn(0.2).play();
                }
            }
        }
    });

    if (!clonedScene) return null;
    
    return (
        <group ref={groupRef} position={position} scale={scale}>
            <primitive object={clonedScene} />
        </group>
    );
}

export default function PokemonModel(props: PokemonModelProps) {
    return (
        <Suspense fallback={null}>
            <Model {...props} />
        </Suspense>
    );
}



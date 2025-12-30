import { useRef, useEffect, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { usePokemon } from './PokemonContext';

const MOVE_SPEED = 5;
const ROTATION_SPEED = 3;

const Character = forwardRef<Group>((props, ref) => {
    const internalRef = useRef<Group>(null);
    const groupRef = (ref as React.RefObject<Group>) || internalRef;
    const keysRef = useRef<Record<string, boolean>>({});
    const { isGameStarted } = usePokemon();

    // Keyboard controls
    useEffect(() => {
        if (!isGameStarted) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (key === 'w' || key === 'a' || key === 's' || key === 'd' || 
                key === 'arrowup' || key === 'arrowdown' || key === 'arrowleft' || key === 'arrowright') {
                keysRef.current[key] = true;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            keysRef.current[key] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isGameStarted]);

    useFrame((_, delta) => {
        if (!groupRef.current || !isGameStarted) return;

        const keys = keysRef.current;
        let forward = 0;
        let rotate = 0;

        // Movement input
        if (keys['w'] || keys['arrowup']) forward += 1;
        if (keys['s'] || keys['arrowdown']) forward -= 1;
        if (keys['a'] || keys['arrowleft']) rotate += 1;
        if (keys['d'] || keys['arrowright']) rotate -= 1;

        // Rotate character smoothly
        if (rotate !== 0) {
            groupRef.current.rotation.y += rotate * ROTATION_SPEED * delta;
        }

        // Move forward/backward in the direction character is facing
        if (forward !== 0) {
            const currentRotation = groupRef.current.rotation.y;
            const moveX = Math.sin(currentRotation) * forward;
            const moveZ = Math.cos(currentRotation) * forward;
            
            const moveAmount = new Vector3(moveX, 0, moveZ).multiplyScalar(MOVE_SPEED * delta);
            groupRef.current.position.add(moveAmount);
        }
    });

    if (!isGameStarted) return null;

    return (
        <group ref={groupRef} position={[0, 0.5, 0]}>
            {/* Body */}
            <mesh position={[0, 0.3, 0]}>
                <boxGeometry args={[0.4, 0.6, 0.3]} />
                <meshStandardMaterial color="#ff6b6b" />
            </mesh>

            {/* Head */}
            <mesh position={[0, 0.8, 0]}>
                <sphereGeometry args={[0.25, 16, 16]} />
                <meshStandardMaterial color="#ffdbac" />
            </mesh>

            {/* Hat */}
            <mesh position={[0, 1.05, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 0.15, 16]} />
                <meshStandardMaterial color="#4a90e2" />
            </mesh>
            <mesh position={[0, 1.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.35, 0.3, 0.05, 16]} />
                <meshStandardMaterial color="#4a90e2" />
            </mesh>

            {/* Left arm */}
            <mesh position={[-0.3, 0.4, 0]}>
                <boxGeometry args={[0.12, 0.3, 0.12]} />
                <meshStandardMaterial color="#ffdbac" />
            </mesh>

            {/* Right arm */}
            <mesh position={[0.3, 0.4, 0]}>
                <boxGeometry args={[0.12, 0.3, 0.12]} />
                <meshStandardMaterial color="#ffdbac" />
            </mesh>

            {/* Left leg */}
            <mesh position={[-0.12, 0, 0]}>
                <boxGeometry args={[0.15, 0.3, 0.15]} />
                <meshStandardMaterial color="#2d2d2d" />
            </mesh>

            {/* Right leg */}
            <mesh position={[0.12, 0, 0]}>
                <boxGeometry args={[0.15, 0.3, 0.15]} />
                <meshStandardMaterial color="#2d2d2d" />
            </mesh>
        </group>
    );
});

Character.displayName = 'Character';

export default Character;

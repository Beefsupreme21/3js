import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { useGame } from './GameContext';

const MOVE_SPEED = 14;
const MAX_X = 7.5; // Adjusted for 5 lanes (track width 20, so max is about 7.5)
const TILT_AMOUNT = 0.4;
const TILT_SPEED = 8;
const GROUND_Y = 0.5;

export default function Player() {
    const groupRef = useRef<Group>(null);
    const keysRef = useRef<Record<string, boolean>>({});
    const velocityRef = useRef(0);
    const { playerPosition, shiftUp, shiftDown } = useGame();

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            keysRef.current[e.key.toLowerCase()] = true;
            if (e.key === 'ArrowLeft') keysRef.current['arrowleft'] = true;
            if (e.key === 'ArrowRight') keysRef.current['arrowright'] = true;
            if (e.key === 'ArrowUp') keysRef.current['arrowup'] = true;
            if (e.key === 'ArrowDown') keysRef.current['arrowdown'] = true;
            
            // Handle gear shifting on keydown (once per press)
            if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
                shiftUp();
            }
            if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
                shiftDown();
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keysRef.current[e.key.toLowerCase()] = false;
            if (e.key === 'ArrowLeft') keysRef.current['arrowleft'] = false;
            if (e.key === 'ArrowRight') keysRef.current['arrowright'] = false;
            if (e.key === 'ArrowUp') keysRef.current['arrowup'] = false;
            if (e.key === 'ArrowDown') keysRef.current['arrowdown'] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [shiftUp, shiftDown]);

    // Smooth continuous movement
    useFrame((_, delta) => {
        if (!groupRef.current) return;

        const keys = keysRef.current;
        let targetVelocity = 0;

        // Check for left/right input
        if (keys['a'] || keys['arrowleft']) {
            targetVelocity = -MOVE_SPEED;
        }
        if (keys['d'] || keys['arrowright']) {
            targetVelocity = MOVE_SPEED;
        }

        // Jump removed - just driving

        // Keep car on ground
        groupRef.current.position.y = GROUND_Y;

        // Smooth acceleration/deceleration
        velocityRef.current += (targetVelocity - velocityRef.current) * 10 * delta;

        // Apply horizontal movement
        const newX = groupRef.current.position.x + velocityRef.current * delta;
        groupRef.current.position.x = Math.max(-MAX_X, Math.min(MAX_X, newX));

        // Update shared player position for collision detection
        playerPosition.current.copy(groupRef.current.position);

        // Smooth tilt based on velocity
        const targetTilt = -(velocityRef.current / MOVE_SPEED) * TILT_AMOUNT;
        groupRef.current.rotation.z += (targetTilt - groupRef.current.rotation.z) * TILT_SPEED * delta;
    });

    return (
        <group ref={groupRef} position={[0, 0.5, 0]}>
            {/* Ship body - sleek low-poly style */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1.2, 0.3, 2]} />
                <meshStandardMaterial color="#00ffff" metalness={0.8} roughness={0.2} emissive="#00ffff" emissiveIntensity={0.3} />
            </mesh>

            {/* Cockpit */}
            <mesh position={[0, 0.25, -0.2]}>
                <boxGeometry args={[0.6, 0.3, 0.8]} />
                <meshStandardMaterial color="#001a33" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Left wing */}
            <mesh position={[-0.8, -0.05, 0.3]} rotation={[0, 0, -0.2]}>
                <boxGeometry args={[0.8, 0.1, 1.2]} />
                <meshStandardMaterial color="#00cccc" metalness={0.7} roughness={0.3} emissive="#00ffff" emissiveIntensity={0.2} />
            </mesh>

            {/* Right wing */}
            <mesh position={[0.8, -0.05, 0.3]} rotation={[0, 0, 0.2]}>
                <boxGeometry args={[0.8, 0.1, 1.2]} />
                <meshStandardMaterial color="#00cccc" metalness={0.7} roughness={0.3} emissive="#00ffff" emissiveIntensity={0.2} />
            </mesh>

            {/* Engine glow - left */}
            <mesh position={[-0.3, 0, 1.1]}>
                <boxGeometry args={[0.25, 0.2, 0.3]} />
                <meshStandardMaterial color="#ff6b35" emissive="#ff6b35" emissiveIntensity={2} />
            </mesh>

            {/* Engine glow - right */}
            <mesh position={[0.3, 0, 1.1]}>
                <boxGeometry args={[0.25, 0.2, 0.3]} />
                <meshStandardMaterial color="#ff6b35" emissive="#ff6b35" emissiveIntensity={2} />
            </mesh>

            {/* Point light for ship glow */}
            <pointLight position={[0, 0.5, 0]} color="#00ffff" intensity={2} distance={5} />
        </group>
    );
}

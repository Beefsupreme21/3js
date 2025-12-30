import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh } from 'three';
import { useGame } from './GameContext';

interface LineData {
    x: number;
    y: number;
    z: number;
    length: number;
    speed: number;
}

export default function SpeedLines() {
    const groupRef = useRef<Group>(null);
    const { isBoosting, playerPosition, isGameStarted, isGameOver } = useGame();

    // Create 8 speed lines with initial positions
    const linesRef = useRef<LineData[]>(
        useMemo(() => {
            return Array.from({ length: 8 }, () => ({
                x: (Math.random() - 0.5) * 4,
                y: (Math.random() - 0.5) * 2,
                z: -1 - Math.random() * 2, // Start behind (negative z), stream forward
                length: 0.5 + Math.random() * 1,
                speed: 0.5 + Math.random() * 0.5,
            }));
        }, [])
    );

    const meshRefs = useRef<(Mesh | null)[]>([]);

    useFrame((_, delta) => {
        if (!groupRef.current || !isGameStarted || isGameOver) return;

        // Position behind the player (on the other side)
        const playerPos = playerPosition.current;
        groupRef.current.position.set(playerPos.x, playerPos.y, playerPos.z + 4);

        // Only animate if boosting
        if (!isBoosting) return;

        // Update each line
        linesRef.current.forEach((line, i) => {
            const mesh = meshRefs.current[i];
            if (!mesh) return;

            // Move forward (more positive Z) to create speed effect
            line.z += line.speed * delta * 15;
            
            // Reset if too far forward (more positive)
            if (line.z > 5) {
                line.z = -1 - Math.random() * 2;
                line.x = (Math.random() - 0.5) * 4;
                line.y = (Math.random() - 0.5) * 2;
            }

            // Update mesh position and scale
            mesh.position.set(line.x, line.y, line.z);
            mesh.scale.set(1, 1, line.length);
        });
    });

    if (!isGameStarted || isGameOver) return null;

    return (
        <group ref={groupRef}>
            {linesRef.current.map((line, i) => (
                <mesh
                    key={i}
                    ref={(el) => {
                        meshRefs.current[i] = el;
                    }}
                    position={[line.x, line.y, line.z]}
                    scale={[1, 1, line.length]}
                >
                    <boxGeometry args={[0.05, 0.05, 1]} />
                    <meshStandardMaterial
                        color="#00ffff"
                        emissive="#00ffff"
                        emissiveIntensity={isBoosting ? 2 : 0}
                        transparent
                        opacity={isBoosting ? 0.8 : 0}
                    />
                </mesh>
            ))}
        </group>
    );
}


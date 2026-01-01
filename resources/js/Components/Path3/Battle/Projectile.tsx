import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';

interface ProjectileProps {
    from: [number, number, number];
    to: [number, number, number];
    type: 'arrow' | 'wand' | 'spell' | 'melee';
    onComplete: () => void;
}

export default function Projectile({ from, to, type, onComplete }: ProjectileProps) {
    const groupRef = useRef<Group>(null);
    const startPos = new Vector3(...from);
    const endPos = new Vector3(...to);
    const distance = startPos.distanceTo(endPos);
    const speed = 0.3; // units per frame
    const totalFrames = Math.ceil(distance / speed);
    let frame = 0;

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        
        frame++;
        const progress = Math.min(frame / totalFrames, 1);
        
        // Linear interpolation
        const currentPos = new Vector3().lerpVectors(startPos, endPos, progress);
        groupRef.current.position.copy(currentPos);
        
        // Rotate projectile to face direction
        const direction = new Vector3().subVectors(endPos, startPos);
        if (direction.length() > 0.001) {
            direction.normalize();
            // Calculate rotation to face the direction
            const angle = Math.atan2(direction.y, direction.x);
            groupRef.current.rotation.z = angle;
        }
        
        if (progress >= 1) {
            onComplete();
        }
    });

    const getProjectileMesh = () => {
        switch (type) {
            case 'arrow':
                return (
                    <group>
                        {/* Arrow shaft - pointing in +X direction, larger and more visible */}
                        <mesh position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                            <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
                            <meshStandardMaterial color="#8B4513" />
                        </mesh>
                        {/* Arrow head - larger */}
                        <mesh position={[0.45, 0, 0]} rotation={[0, 0, 0]}>
                            <coneGeometry args={[0.1, 0.2, 6]} />
                            <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
                        </mesh>
                        {/* Fletching - larger */}
                        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                            <boxGeometry args={[0.1, 0.2, 0.04]} />
                            <meshStandardMaterial color="#654321" />
                        </mesh>
                    </group>
                );
            case 'wand':
                return (
                    <mesh>
                        <sphereGeometry args={[0.08, 8, 8]} />
                        <meshStandardMaterial 
                            color="#00ffff"
                            emissive="#00ffff"
                            emissiveIntensity={0.8}
                        />
                    </mesh>
                );
            case 'spell':
                return (
                    <mesh>
                        <sphereGeometry args={[0.08, 8, 8]} />
                        <meshStandardMaterial 
                            color="#8B008B"
                            emissive="#4B0082"
                            emissiveIntensity={0.8}
                        />
                    </mesh>
                );
            case 'melee':
                // Melee "slash" effect
                return (
                    <mesh>
                        <boxGeometry args={[0.2, 0.3, 0.05]} />
                        <meshStandardMaterial color="#ffff00" transparent opacity={0.7} />
                    </mesh>
                );
            default:
                return null;
        }
    };

    return (
        <group ref={groupRef} position={from}>
            {getProjectileMesh()}
        </group>
    );
}


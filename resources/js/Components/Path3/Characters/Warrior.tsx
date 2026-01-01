import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

interface WarriorProps {
    position: [number, number, number];
}

export default function Warrior({ position }: WarriorProps) {
    const groupRef = useRef<Group>(null);
    
    // Gentle idle animation
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.05;
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {/* Body/Torso */}
            <mesh position={[0, 0.3, 0]}>
                <boxGeometry args={[0.6, 0.8, 0.4]} />
                <meshStandardMaterial color="#8B4513" metalness={0.3} roughness={0.7} />
            </mesh>
            
            {/* Head */}
            <mesh position={[0, 0.9, 0]}>
                <boxGeometry args={[0.4, 0.4, 0.4]} />
                <meshStandardMaterial color="#FFDBAC" />
            </mesh>
            
            {/* Helmet */}
            <mesh position={[0, 1.0, 0]}>
                <boxGeometry args={[0.45, 0.2, 0.45]} />
                <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
            </mesh>
            
            {/* Left Arm */}
            <mesh position={[-0.5, 0.2, 0]} rotation={[0, 0, 0.3]}>
                <boxGeometry args={[0.2, 0.6, 0.2]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>
            
            {/* Right Arm */}
            <mesh position={[0.5, 0.2, 0]} rotation={[0, 0, -0.3]}>
                <boxGeometry args={[0.2, 0.6, 0.2]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>
            
            {/* Sword */}
            <mesh position={[0.7, 0.1, 0]} rotation={[0, 0, -0.5]}>
                <boxGeometry args={[0.1, 0.8, 0.1]} />
                <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
            </mesh>
            
            {/* Shield */}
            <mesh position={[-0.6, 0.3, 0]}>
                <boxGeometry args={[0.15, 0.7, 0.1]} />
                <meshStandardMaterial color="#654321" metalness={0.5} roughness={0.5} />
            </mesh>
            
            {/* Legs */}
            <mesh position={[-0.2, -0.5, 0]}>
                <boxGeometry args={[0.2, 0.6, 0.2]} />
                <meshStandardMaterial color="#654321" />
            </mesh>
            <mesh position={[0.2, -0.5, 0]}>
                <boxGeometry args={[0.2, 0.6, 0.2]} />
                <meshStandardMaterial color="#654321" />
            </mesh>
        </group>
    );
}


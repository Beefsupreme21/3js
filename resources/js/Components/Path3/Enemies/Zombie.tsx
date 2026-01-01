import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

interface ZombieProps {
    position: [number, number, number];
}

export default function Zombie({ position }: ZombieProps) {
    const groupRef = useRef<Group>(null);
    const headRef = useRef<Group>(null);
    
    // Gentle idle animation with slight sway
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.05;
            // Slight swaying motion
            groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
        }
        if (headRef.current) {
            // Slight head bob
            headRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {/* Body/Torso - torn and decayed */}
            <mesh position={[0, 0.3, 0]}>
                <boxGeometry args={[0.6, 0.8, 0.4]} />
                <meshStandardMaterial color="#556B2F" metalness={0.1} roughness={0.9} />
            </mesh>
            
            {/* Head - slightly tilted */}
            <group ref={headRef} position={[0, 0.9, 0]}>
                <mesh>
                    <boxGeometry args={[0.4, 0.4, 0.4]} />
                    <meshStandardMaterial color="#8B7355" />
                </mesh>
                {/* Rotting flesh patches */}
                <mesh position={[0.15, 0.1, 0.2]}>
                    <boxGeometry args={[0.1, 0.15, 0.05]} />
                    <meshStandardMaterial color="#654321" />
                </mesh>
            </group>
            
            {/* Left Arm - hanging lower */}
            <mesh position={[-0.5, 0.1, 0]} rotation={[0, 0, 0.5]}>
                <boxGeometry args={[0.2, 0.6, 0.2]} />
                <meshStandardMaterial color="#556B2F" />
            </mesh>
            
            {/* Right Arm - reaching forward */}
            <mesh position={[0.5, 0.2, 0]} rotation={[0, 0, -0.3]}>
                <boxGeometry args={[0.2, 0.6, 0.2]} />
                <meshStandardMaterial color="#556B2F" />
            </mesh>
            
            {/* Clawed hand */}
            <mesh position={[0.7, -0.1, 0]} rotation={[0, 0, -0.4]}>
                <boxGeometry args={[0.15, 0.3, 0.15]} />
                <meshStandardMaterial color="#8B7355" />
            </mesh>
            
            {/* Legs - staggered stance */}
            <mesh position={[-0.2, -0.5, 0]} rotation={[0, 0, 0.1]}>
                <boxGeometry args={[0.2, 0.6, 0.2]} />
                <meshStandardMaterial color="#556B2F" />
            </mesh>
            <mesh position={[0.2, -0.5, 0]} rotation={[0, 0, -0.1]}>
                <boxGeometry args={[0.2, 0.6, 0.2]} />
                <meshStandardMaterial color="#556B2F" />
            </mesh>
            
            {/* Glowing red eyes */}
            <mesh position={[-0.1, 0.95, 0.21]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial 
                    color="#ff0000" 
                    emissive="#ff0000" 
                    emissiveIntensity={0.8}
                />
            </mesh>
            <mesh position={[0.1, 0.95, 0.21]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial 
                    color="#ff0000" 
                    emissive="#ff0000" 
                    emissiveIntensity={0.8}
                />
            </mesh>
        </group>
    );
}


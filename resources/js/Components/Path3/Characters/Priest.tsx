import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

interface PriestProps {
    position: [number, number, number];
}

export default function Priest({ position }: PriestProps) {
    const groupRef = useRef<Group>(null);
    const staffRef = useRef<Group>(null);
    
    // Gentle idle animation
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + 4) * 0.05;
        }
        if (staffRef.current) {
            // Gentle staff glow animation
            staffRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {/* Body/Robe */}
            <mesh position={[0, 0.2, 0]}>
                <boxGeometry args={[0.55, 0.9, 0.4]} />
                <meshStandardMaterial color="#F5F5DC" metalness={0.1} roughness={0.9} />
            </mesh>
            
            {/* Head */}
            <mesh position={[0, 0.8, 0]}>
                <boxGeometry args={[0.35, 0.35, 0.35]} />
                <meshStandardMaterial color="#FFDBAC" />
            </mesh>
            
            {/* Holy Symbol/Crown */}
            <mesh position={[0, 1.0, 0]}>
                <boxGeometry args={[0.4, 0.15, 0.4]} />
                <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.3} />
            </mesh>
            
            {/* Left Arm */}
            <mesh position={[-0.5, 0.2, 0]} rotation={[0, 0, 0.2]}>
                <boxGeometry args={[0.15, 0.5, 0.15]} />
                <meshStandardMaterial color="#F5F5DC" />
            </mesh>
            
            {/* Right Arm */}
            <mesh position={[0.5, 0.2, 0]} rotation={[0, 0, -0.2]}>
                <boxGeometry args={[0.15, 0.5, 0.15]} />
                <meshStandardMaterial color="#F5F5DC" />
            </mesh>
            
            {/* Holy Staff */}
            <group ref={staffRef} position={[0.6, 0.1, 0]}>
                <mesh position={[0, 0.4, 0]}>
                    <boxGeometry args={[0.08, 0.8, 0.08]} />
                    <meshStandardMaterial color="#8B4513" />
                </mesh>
                {/* Holy orb */}
                <mesh position={[0, 0.9, 0]}>
                    <sphereGeometry args={[0.15, 8, 8]} />
                    <meshStandardMaterial 
                        color="#ffffff" 
                        emissive="#ffff00" 
                        emissiveIntensity={0.6}
                    />
                </mesh>
            </group>
            
            {/* Legs */}
            <mesh position={[-0.15, -0.4, 0]}>
                <boxGeometry args={[0.18, 0.5, 0.18]} />
                <meshStandardMaterial color="#E6E6FA" />
            </mesh>
            <mesh position={[0.15, -0.4, 0]}>
                <boxGeometry args={[0.18, 0.5, 0.18]} />
                <meshStandardMaterial color="#E6E6FA" />
            </mesh>
        </group>
    );
}


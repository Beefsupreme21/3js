import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

interface MageProps {
    position: [number, number, number];
}

export default function Mage({ position }: MageProps) {
    const groupRef = useRef<Group>(null);
    const staffRef = useRef<Group>(null);
    
    // Gentle idle animation
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + 2) * 0.05;
        }
        if (staffRef.current) {
            // Gentle staff glow animation
            staffRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {/* Body/Robe */}
            <mesh position={[0, 0.2, 0]}>
                <boxGeometry args={[0.55, 0.9, 0.4]} />
                <meshStandardMaterial color="#4A148C" metalness={0.1} roughness={0.9} />
            </mesh>
            
            {/* Head */}
            <mesh position={[0, 0.8, 0]}>
                <boxGeometry args={[0.35, 0.35, 0.35]} />
                <meshStandardMaterial color="#FFDBAC" />
            </mesh>
            
            {/* Wizard Hat */}
            <mesh position={[0, 1.1, 0]}>
                <coneGeometry args={[0.3, 0.4, 8]} />
                <meshStandardMaterial color="#1a0033" />
            </mesh>
            <mesh position={[0, 0.95, 0]}>
                <boxGeometry args={[0.4, 0.1, 0.4]} />
                <meshStandardMaterial color="#1a0033" />
            </mesh>
            
            {/* Left Arm */}
            <mesh position={[-0.5, 0.2, 0]} rotation={[0, 0, 0.2]}>
                <boxGeometry args={[0.15, 0.5, 0.15]} />
                <meshStandardMaterial color="#4A148C" />
            </mesh>
            
            {/* Right Arm */}
            <mesh position={[0.5, 0.2, 0]} rotation={[0, 0, -0.2]}>
                <boxGeometry args={[0.15, 0.5, 0.15]} />
                <meshStandardMaterial color="#4A148C" />
            </mesh>
            
            {/* Staff */}
            <group ref={staffRef} position={[0.6, 0.1, 0]}>
                <mesh position={[0, 0.4, 0]}>
                    <boxGeometry args={[0.08, 0.8, 0.08]} />
                    <meshStandardMaterial color="#8B4513" />
                </mesh>
                {/* Staff orb */}
                <mesh position={[0, 0.9, 0]}>
                    <sphereGeometry args={[0.15, 8, 8]} />
                    <meshStandardMaterial 
                        color="#00ffff" 
                        emissive="#00ffff" 
                        emissiveIntensity={0.5}
                    />
                </mesh>
            </group>
            
            {/* Legs (under robe) */}
            <mesh position={[-0.15, -0.4, 0]}>
                <boxGeometry args={[0.18, 0.5, 0.18]} />
                <meshStandardMaterial color="#2d0033" />
            </mesh>
            <mesh position={[0.15, -0.4, 0]}>
                <boxGeometry args={[0.18, 0.5, 0.18]} />
                <meshStandardMaterial color="#2d0033" />
            </mesh>
        </group>
    );
}


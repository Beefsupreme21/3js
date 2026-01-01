import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

interface WarlockProps {
    position: [number, number, number];
}

export default function Warlock({ position }: WarlockProps) {
    const groupRef = useRef<Group>(null);
    const orbRef = useRef<Group>(null);
    
    // Gentle idle animation
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + 3) * 0.05;
        }
        if (orbRef.current) {
            // Floating dark orb animation
            orbRef.current.position.y = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
            orbRef.current.rotation.y += 0.02;
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {/* Body/Robe */}
            <mesh position={[0, 0.2, 0]}>
                <boxGeometry args={[0.55, 0.9, 0.4]} />
                <meshStandardMaterial color="#1a0033" metalness={0.1} roughness={0.9} />
            </mesh>
            
            {/* Head */}
            <mesh position={[0, 0.8, 0]}>
                <boxGeometry args={[0.35, 0.35, 0.35]} />
                <meshStandardMaterial color="#FFDBAC" />
            </mesh>
            
            {/* Dark Hood */}
            <mesh position={[0, 0.9, 0]}>
                <boxGeometry args={[0.45, 0.3, 0.45]} />
                <meshStandardMaterial color="#000000" />
            </mesh>
            
            {/* Left Arm */}
            <mesh position={[-0.5, 0.2, 0]} rotation={[0, 0, 0.2]}>
                <boxGeometry args={[0.15, 0.5, 0.15]} />
                <meshStandardMaterial color="#1a0033" />
            </mesh>
            
            {/* Right Arm */}
            <mesh position={[0.5, 0.2, 0]} rotation={[0, 0, -0.2]}>
                <boxGeometry args={[0.15, 0.5, 0.15]} />
                <meshStandardMaterial color="#1a0033" />
            </mesh>
            
            {/* Floating Dark Orb */}
            <group ref={orbRef} position={[0.6, 0.6, 0]}>
                <mesh>
                    <sphereGeometry args={[0.12, 8, 8]} />
                    <meshStandardMaterial 
                        color="#8B008B" 
                        emissive="#4B0082" 
                        emissiveIntensity={0.8}
                    />
                </mesh>
            </group>
            
            {/* Legs */}
            <mesh position={[-0.15, -0.4, 0]}>
                <boxGeometry args={[0.18, 0.5, 0.18]} />
                <meshStandardMaterial color="#0d0015" />
            </mesh>
            <mesh position={[0.15, -0.4, 0]}>
                <boxGeometry args={[0.18, 0.5, 0.18]} />
                <meshStandardMaterial color="#0d0015" />
            </mesh>
        </group>
    );
}


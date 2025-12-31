import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { usePath2 } from '../Path2Context';

interface HunterProps {
    position: [number, number, number];
}

export default function Hunter({ position }: HunterProps) {
    const groupRef = useRef<Group>(null);
    const { selectCharacter, selectedTeam } = usePath2();
    const isSelected = selectedTeam.includes('hunter');
    
    // Gentle idle animation
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + 1) * 0.05;
        }
    });
    
    const handleClick = () => {
        selectCharacter('hunter');
    };

    return (
        <group 
            ref={groupRef} 
            position={position}
            onClick={handleClick}
            onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
                document.body.style.cursor = 'default';
            }}
        >
            {isSelected && (
                <mesh position={[0, 0, 0]}>
                    <ringGeometry args={[1.2, 1.4, 32]} />
                    <meshBasicMaterial color="#00ff00" transparent opacity={0.5} />
                </mesh>
            )}
            {/* Body/Torso */}
            <mesh position={[0, 0.3, 0]}>
                <boxGeometry args={[0.5, 0.7, 0.3]} />
                <meshStandardMaterial color="#8B7355" metalness={0.2} roughness={0.8} />
            </mesh>
            
            {/* Head */}
            <mesh position={[0, 0.85, 0]}>
                <boxGeometry args={[0.35, 0.35, 0.35]} />
                <meshStandardMaterial color="#FFDBAC" />
            </mesh>
            
            {/* Hood */}
            <mesh position={[0, 0.9, 0]}>
                <boxGeometry args={[0.4, 0.25, 0.4]} />
                <meshStandardMaterial color="#4A5D23" />
            </mesh>
            
            {/* Left Arm */}
            <mesh position={[-0.45, 0.2, 0]} rotation={[0, 0, 0.2]}>
                <boxGeometry args={[0.15, 0.5, 0.15]} />
                <meshStandardMaterial color="#8B7355" />
            </mesh>
            
            {/* Right Arm - holding bow */}
            <mesh position={[0.45, 0.2, 0]} rotation={[0, 0, -0.2]}>
                <boxGeometry args={[0.15, 0.5, 0.15]} />
                <meshStandardMaterial color="#8B7355" />
            </mesh>
            
            {/* Bow */}
            <mesh position={[0.6, 0.3, 0]} rotation={[0, 0, -0.3]}>
                <boxGeometry args={[0.1, 0.6, 0.05]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>
            
            {/* Quiver */}
            <mesh position={[-0.4, 0.1, 0.2]}>
                <boxGeometry args={[0.15, 0.5, 0.1]} />
                <meshStandardMaterial color="#654321" />
            </mesh>
            
            {/* Legs */}
            <mesh position={[-0.15, -0.5, 0]}>
                <boxGeometry args={[0.18, 0.6, 0.18]} />
                <meshStandardMaterial color="#654321" />
            </mesh>
            <mesh position={[0.15, -0.5, 0]}>
                <boxGeometry args={[0.18, 0.6, 0.18]} />
                <meshStandardMaterial color="#654321" />
            </mesh>
        </group>
    );
}


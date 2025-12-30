import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { useGolf } from './GolfContext';

export default function Golfer() {
    const groupRef = useRef<Group>(null);
    const { isGameStarted } = useGolf();

    // Subtle idle animation
    useFrame((state) => {
        if (!groupRef.current || !isGameStarted) return;
        // Gentle breathing/swaying animation
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    });

    if (!isGameStarted) return null;

    return (
        <group ref={groupRef} position={[-0.5, 0, 0.3]}>
            {/* Body - torso */}
            <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[0.4, 0.6, 0.3]} />
                <meshStandardMaterial color="#4a90e2" />
            </mesh>

            {/* Head */}
            <mesh position={[0, 1.1, 0]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial color="#ffdbac" />
            </mesh>

            {/* Hat */}
            <mesh position={[0, 1.25, 0]}>
                <cylinderGeometry args={[0.25, 0.25, 0.1, 16]} />
                <meshStandardMaterial color="#2d5016" />
            </mesh>
            <mesh position={[0, 1.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.3, 0.25, 0.05, 16]} />
                <meshStandardMaterial color="#2d5016" />
            </mesh>

            {/* Left arm - holding club */}
            <mesh position={[-0.3, 0.6, 0]} rotation={[0, 0, 0.3]}>
                <boxGeometry args={[0.15, 0.4, 0.15]} />
                <meshStandardMaterial color="#ffdbac" />
            </mesh>

            {/* Right arm */}
            <mesh position={[0.3, 0.6, 0]} rotation={[0, 0, -0.2]}>
                <boxGeometry args={[0.15, 0.4, 0.15]} />
                <meshStandardMaterial color="#ffdbac" />
            </mesh>

            {/* Left leg */}
            <mesh position={[-0.15, 0.1, 0]}>
                <boxGeometry args={[0.15, 0.4, 0.15]} />
                <meshStandardMaterial color="#2d2d2d" />
            </mesh>

            {/* Right leg */}
            <mesh position={[0.15, 0.1, 0]}>
                <boxGeometry args={[0.15, 0.4, 0.15]} />
                <meshStandardMaterial color="#2d2d2d" />
            </mesh>

            {/* Golf club - in left hand */}
            <group position={[-0.5, 0.4, 0]} rotation={[0, 0, 0.5]}>
                {/* Club shaft */}
                <mesh position={[0, -0.3, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
                    <meshStandardMaterial color="#8b4513" />
                </mesh>
                {/* Club head */}
                <mesh position={[0, -0.7, 0.05]}>
                    <boxGeometry args={[0.15, 0.05, 0.2]} />
                    <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
                </mesh>
            </group>
        </group>
    );
}


import { forwardRef } from 'react';
import { Group } from 'three';
import { useGolf2 } from './Golf2Context';

const Character = forwardRef<Group>((props, ref) => {
    const { isGameStarted } = useGolf2();

    if (!isGameStarted) return null;

    return (
        <group ref={ref} position={[0, 0.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
            {/* Body */}
            <mesh position={[0, 0.3, 0]}>
                <boxGeometry args={[0.4, 0.6, 0.3]} />
                <meshStandardMaterial color="#ff6b6b" />
            </mesh>

            {/* Head */}
            <mesh position={[0, 0.8, 0]}>
                <sphereGeometry args={[0.25, 16, 16]} />
                <meshStandardMaterial color="#ffdbac" />
            </mesh>

            {/* Hat */}
            <mesh position={[0, 1.05, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 0.15, 16]} />
                <meshStandardMaterial color="#4a90e2" />
            </mesh>
            <mesh position={[0, 1.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.35, 0.3, 0.05, 16]} />
                <meshStandardMaterial color="#4a90e2" />
            </mesh>

            {/* Left arm */}
            <mesh position={[-0.3, 0.4, 0]}>
                <boxGeometry args={[0.12, 0.3, 0.12]} />
                <meshStandardMaterial color="#ffdbac" />
            </mesh>

            {/* Right arm */}
            <mesh position={[0.3, 0.4, 0]}>
                <boxGeometry args={[0.12, 0.3, 0.12]} />
                <meshStandardMaterial color="#ffdbac" />
            </mesh>

            {/* Golf Club in right hand */}
            <group position={[0.3, 0.25, 0]} rotation={[0, 0, Math.PI / 6]}>
                {/* Club shaft */}
                <mesh position={[0, -0.2, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
                    <meshStandardMaterial color="#8b4513" />
                </mesh>
                {/* Club head */}
                <mesh position={[0, -0.5, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
                    <boxGeometry args={[0.08, 0.12, 0.04]} />
                    <meshStandardMaterial color="#2d2d2d" metalness={0.8} roughness={0.2} />
                </mesh>
            </group>

            {/* Left leg */}
            <mesh position={[-0.12, 0, 0]}>
                <boxGeometry args={[0.15, 0.3, 0.15]} />
                <meshStandardMaterial color="#2d2d2d" />
            </mesh>

            {/* Right leg */}
            <mesh position={[0.12, 0, 0]}>
                <boxGeometry args={[0.15, 0.3, 0.15]} />
                <meshStandardMaterial color="#2d2d2d" />
            </mesh>
        </group>
    );
});

Character.displayName = 'Character';

export default Character;


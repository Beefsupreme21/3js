import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { useGame } from './GameContext';

export default function Explosion() {
    const { explosionPosition } = useGame();
    const groupRef = useRef<Group>(null);
    const scaleRef = useRef(1);

    useFrame((_, delta) => {
        if (groupRef.current && scaleRef.current < 3) {
            scaleRef.current += delta * 4;
            groupRef.current.scale.setScalar(scaleRef.current);
        }
    });

    if (!explosionPosition) return null;

    return (
        <group ref={groupRef} position={explosionPosition}>
            {/* Central flash */}
            <mesh>
                <sphereGeometry args={[1.5, 16, 16]} />
                <meshBasicMaterial color="#ff6600" transparent opacity={0.9} />
            </mesh>
            {/* Outer glow */}
            <mesh>
                <sphereGeometry args={[2.5, 16, 16]} />
                <meshBasicMaterial color="#ff0000" transparent opacity={0.5} />
            </mesh>
            {/* Outermost ring */}
            <mesh>
                <sphereGeometry args={[3.5, 16, 16]} />
                <meshBasicMaterial color="#ff3300" transparent opacity={0.2} />
            </mesh>
            {/* Point light for dramatic effect */}
            <pointLight color="#ff6600" intensity={800} distance={30} />
        </group>
    );
}

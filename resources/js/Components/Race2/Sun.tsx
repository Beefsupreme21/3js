import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { useGame } from './GameContext';

export default function Sun() {
    const glowRef = useRef<Mesh>(null);
    const { level } = useGame();

    // Subtle pulse animation
    useFrame(({ clock }) => {
        if (glowRef.current) {
            const pulse = 1 + Math.sin(clock.elapsedTime * 0.5) * 0.03;
            glowRef.current.scale.setScalar(pulse);
        }
    });

    // Level 1: Coral/pink sun
    if (level === 1) {
        return (
            <group position={[25, 18, -60]}>
                {/* The Sun - main body */}
                <mesh>
                    <circleGeometry args={[10, 64]} />
                    <meshBasicMaterial color="#ff4466" fog={false} />
                </mesh>

                {/* Sun outer glow */}
                <mesh ref={glowRef} position={[0, 0, -0.5]}>
                    <circleGeometry args={[14, 64]} />
                    <meshBasicMaterial color="#ff6644" transparent opacity={0.25} fog={false} />
                </mesh>

                {/* Sun bloom */}
                <mesh position={[0, 0, -1]}>
                    <circleGeometry args={[18, 64]} />
                    <meshBasicMaterial color="#ff8866" transparent opacity={0.1} fog={false} />
                </mesh>
            </group>
        );
    }

    // Level 2: Blue/white moon
    if (level === 2) {
        return (
            <group position={[25, 18, -60]}>
                {/* The Moon - main body */}
                <mesh>
                    <circleGeometry args={[10, 64]} />
                    <meshBasicMaterial color="#aaccff" fog={false} />
                </mesh>

                {/* Moon craters (subtle dark spots) */}
                <mesh position={[-2, 2, 0.1]}>
                    <circleGeometry args={[1.5, 32]} />
                    <meshBasicMaterial color="#88aadd" fog={false} />
                </mesh>
                <mesh position={[3, -1, 0.1]}>
                    <circleGeometry args={[2, 32]} />
                    <meshBasicMaterial color="#88aadd" fog={false} />
                </mesh>
                <mesh position={[-1, -3, 0.1]}>
                    <circleGeometry args={[1, 32]} />
                    <meshBasicMaterial color="#88aadd" fog={false} />
                </mesh>

                {/* Moon outer glow - cool blue */}
                <mesh ref={glowRef} position={[0, 0, -0.5]}>
                    <circleGeometry args={[14, 64]} />
                    <meshBasicMaterial color="#4488ff" transparent opacity={0.2} fog={false} />
                </mesh>

                {/* Moon bloom */}
                <mesh position={[0, 0, -1]}>
                    <circleGeometry args={[18, 64]} />
                    <meshBasicMaterial color="#6699ff" transparent opacity={0.08} fog={false} />
                </mesh>
            </group>
        );
    }

    // Level 3+: Green toxic glow
    return (
        <group position={[25, 18, -60]}>
            {/* Toxic orb - main body */}
            <mesh>
                <circleGeometry args={[10, 64]} />
                <meshBasicMaterial color="#44ff66" fog={false} />
            </mesh>

            {/* Toxic outer glow */}
            <mesh ref={glowRef} position={[0, 0, -0.5]}>
                <circleGeometry args={[14, 64]} />
                <meshBasicMaterial color="#22ff44" transparent opacity={0.3} fog={false} />
            </mesh>

            {/* Toxic bloom */}
            <mesh position={[0, 0, -1]}>
                <circleGeometry args={[18, 64]} />
                <meshBasicMaterial color="#00ff44" transparent opacity={0.15} fog={false} />
            </mesh>
        </group>
    );
}

export default function Pikachu({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            {/* Body - main yellow sphere */}
            <mesh position={[0, 0.3, 0]}>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial color="#ffd700" />
            </mesh>

            {/* Head - slightly smaller sphere */}
            <mesh position={[0, 0.7, 0]}>
                <sphereGeometry args={[0.25, 16, 16]} />
                <meshStandardMaterial color="#ffd700" />
            </mesh>

            {/* Left ear */}
            <mesh position={[-0.15, 0.9, 0]} rotation={[0, 0, -0.3]}>
                <coneGeometry args={[0.08, 0.3, 4]} />
                <meshStandardMaterial color="#ffd700" />
            </mesh>
            <mesh position={[-0.15, 0.9, 0]} rotation={[0, 0, -0.3]}>
                <coneGeometry args={[0.06, 0.25, 4]} />
                <meshStandardMaterial color="#000000" />
            </mesh>

            {/* Right ear */}
            <mesh position={[0.15, 0.9, 0]} rotation={[0, 0, 0.3]}>
                <coneGeometry args={[0.08, 0.3, 4]} />
                <meshStandardMaterial color="#ffd700" />
            </mesh>
            <mesh position={[0.15, 0.9, 0]} rotation={[0, 0, 0.3]}>
                <coneGeometry args={[0.06, 0.25, 4]} />
                <meshStandardMaterial color="#000000" />
            </mesh>

            {/* Left eye */}
            <mesh position={[-0.1, 0.75, 0.2]}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[-0.08, 0.77, 0.22]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>

            {/* Right eye */}
            <mesh position={[0.1, 0.75, 0.2]}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[0.08, 0.77, 0.22]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>

            {/* Nose */}
            <mesh position={[0, 0.65, 0.22]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial color="#000000" />
            </mesh>

            {/* Mouth */}
            <mesh position={[0, 0.6, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.05, 0.02, 8, 16, Math.PI]} />
                <meshStandardMaterial color="#000000" />
            </mesh>

            {/* Cheek patches */}
            <mesh position={[-0.25, 0.65, 0.15]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshStandardMaterial color="#ff6b6b" />
            </mesh>
            <mesh position={[0.25, 0.65, 0.15]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshStandardMaterial color="#ff6b6b" />
            </mesh>

            {/* Left arm */}
            <mesh position={[-0.25, 0.4, 0]}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshStandardMaterial color="#ffd700" />
            </mesh>

            {/* Right arm */}
            <mesh position={[0.25, 0.4, 0]}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshStandardMaterial color="#ffd700" />
            </mesh>

            {/* Left leg */}
            <mesh position={[-0.12, 0.1, 0]}>
                <sphereGeometry args={[0.12, 8, 8]} />
                <meshStandardMaterial color="#ffd700" />
            </mesh>

            {/* Right leg */}
            <mesh position={[0.12, 0.1, 0]}>
                <sphereGeometry args={[0.12, 8, 8]} />
                <meshStandardMaterial color="#ffd700" />
            </mesh>

            {/* Tail - zigzag shape */}
            <group position={[0, 0.2, -0.3]}>
                <mesh position={[0, 0, 0]} rotation={[0, 0, 0.5]}>
                    <boxGeometry args={[0.08, 0.3, 0.08]} />
                    <meshStandardMaterial color="#ffd700" />
                </mesh>
                <mesh position={[0.1, -0.2, 0]} rotation={[0, 0, -0.5]}>
                    <boxGeometry args={[0.08, 0.25, 0.08]} />
                    <meshStandardMaterial color="#ffd700" />
                </mesh>
                <mesh position={[0, -0.4, 0]} rotation={[0, 0, 0.3]}>
                    <boxGeometry args={[0.08, 0.2, 0.08]} />
                    <meshStandardMaterial color="#ffd700" />
                </mesh>
                {/* Tail tip - brown */}
                <mesh position={[0.05, -0.55, 0]}>
                    <sphereGeometry args={[0.06, 8, 8]} />
                    <meshStandardMaterial color="#8b4513" />
                </mesh>
            </group>
        </group>
    );
}


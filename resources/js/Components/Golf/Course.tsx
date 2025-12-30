export default function Course() {
    return (
        <>
            {/* Ground plane - green */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial color="#2d5016" />
            </mesh>

            {/* Hole - dark circle */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -15]}>
                <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>

            {/* Hole rim */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, -15]}>
                <torusGeometry args={[0.5, 0.05, 16, 32]} />
                <meshStandardMaterial color="#333333" />
            </mesh>

            {/* Flag pole */}
            <mesh position={[0, 1.5, -15]}>
                <cylinderGeometry args={[0.02, 0.02, 3, 8]} />
                <meshStandardMaterial color="#8b4513" />
            </mesh>

            {/* Flag */}
            <mesh position={[0.3, 2.5, -15]} rotation={[0, 0, -Math.PI / 4]}>
                <planeGeometry args={[0.4, 0.3]} />
                <meshStandardMaterial color="#ff0000" />
            </mesh>
        </>
    );
}


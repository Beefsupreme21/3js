export default function Environment() {
    // Generate random positions for trees and grass
    const trees = Array.from({ length: 15 }, () => ({
        x: (Math.random() - 0.5) * 40,
        z: (Math.random() - 0.5) * 40,
    }));

    const grassPatches = Array.from({ length: 30 }, () => ({
        x: (Math.random() - 0.5) * 50,
        z: (Math.random() - 0.5) * 50,
        scale: 0.5 + Math.random() * 0.5,
    }));

    return (
        <>
            {/* Trees */}
            {trees.map((tree, i) => (
                <group key={`tree-${i}`} position={[tree.x, 0, tree.z]}>
                    {/* Tree trunk */}
                    <mesh position={[0, 0.5, 0]}>
                        <cylinderGeometry args={[0.2, 0.2, 1, 8]} />
                        <meshStandardMaterial color="#8b4513" />
                    </mesh>
                    {/* Tree leaves - bottom layer */}
                    <mesh position={[0, 1.3, 0]}>
                        <coneGeometry args={[1, 1.5, 8]} />
                        <meshStandardMaterial color="#228b22" />
                    </mesh>
                    {/* Tree leaves - top layer */}
                    <mesh position={[0, 2, 0]}>
                        <coneGeometry args={[0.7, 1, 8]} />
                        <meshStandardMaterial color="#32cd32" />
                    </mesh>
                </group>
            ))}

            {/* Grass patches */}
            {grassPatches.map((patch, i) => (
                <group key={`grass-${i}`} position={[patch.x, 0.01, patch.z]} scale={patch.scale}>
                    {/* Grass patch base */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]}>
                        <circleGeometry args={[0.8, 8]} />
                        <meshStandardMaterial color="#7cb342" />
                    </mesh>
                    {/* Grass blades */}
                    {Array.from({ length: 8 }, (_, j) => {
                        const angle = (j / 8) * Math.PI * 2;
                        const radius = 0.4 + Math.random() * 0.2;
                        return (
                            <mesh
                                key={j}
                                position={[Math.cos(angle) * radius, 0.1, Math.sin(angle) * radius]}
                                rotation={[0, angle, 0]}
                            >
                                <boxGeometry args={[0.05, 0.2, 0.02]} />
                                <meshStandardMaterial color="#66bb6a" />
                            </mesh>
                        );
                    })}
                </group>
            ))}
        </>
    );
}


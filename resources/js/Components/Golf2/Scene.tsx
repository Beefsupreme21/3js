import Ball from './Ball';
import Trajectory from './Trajectory';

function Ground() {
    return (
        <>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#90ee90" />
            </mesh>
        </>
    );
}

function SpawnMarker() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <torusGeometry args={[0.3, 0.02, 16, 32]} />
            <meshBasicMaterial color={0xff0000} />
        </mesh>
    );
}

function Tree({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            {/* Trunk */}
            <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>
            {/* Leaves */}
            <mesh position={[0, 1.5, 0]}>
                <coneGeometry args={[0.8, 1.5, 8]} />
                <meshStandardMaterial color="#228B22" />
            </mesh>
        </group>
    );
}

export default function Scene() {
    // Scatter some trees around
    const treePositions: [number, number, number][] = [
        [5, 0, -5],
        [-8, 0, -3],
        [10, 0, 8],
        [-6, 0, 10],
        [3, 0, -12],
        [-10, 0, -8],
    ];

    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
            <Ground />
            <SpawnMarker />
            {treePositions.map((pos, i) => (
                <Tree key={i} position={pos} />
            ))}
            <Ball />
            <Trajectory />
        </>
    );
}

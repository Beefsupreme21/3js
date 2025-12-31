import { useMemo } from 'react';
import { Shape } from 'three';
import Ball from './Ball';
import Trajectory from './Trajectory';
import CameraController from './CameraController';

function Ground() {
    return (
        <>
            {/* Rough (darker green, outer area) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[200, 200]} />
                <meshStandardMaterial color="#5a8a5a" />
            </mesh>
            
            {/* Fairway (lighter green, L-shaped) */}
            <Fairway />
            
            {/* Green (light green, circular around hole) - moved right */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[12, 0.002, -30]}>
                <circleGeometry args={[5, 32]} />
                <meshStandardMaterial color="#90ee90" />
            </mesh>
            
            {/* Hills/Terrain variation */}
            <Terrain />
        </>
    );
}

function Fairway() {
    // L-shaped fairway: straight from ball (0, 35) then turns right to hole (12, -30)
    const fairwayShape = useMemo(() => {
        const shape = new Shape();
        const width = 12; // Fairway width
        
        // Ball spawn at (0, 35), hole at (12, -30)
        // Create L-shape: go forward first, then turn right
        const turnPointZ = -20; // Where we turn right
        
        // Start at ball position, going forward (negative Z direction in world, positive Y in shape)
        shape.moveTo(-width / 2, 35); // Left edge at ball spawn
        shape.lineTo(width / 2, 35); // Right edge at ball spawn
        shape.lineTo(width / 2, turnPointZ); // Go forward (straight section)
        shape.lineTo(12 + width / 2, turnPointZ); // Turn right (horizontal section)
        shape.lineTo(12 + width / 2, -30); // Continue to hole
        shape.lineTo(12 - width / 2, -30); // Left edge at hole
        shape.lineTo(12 - width / 2, turnPointZ); // Back along horizontal
        shape.lineTo(-width / 2, turnPointZ); // Back along straight section
        shape.lineTo(-width / 2, 35); // Close the shape
        
        return shape;
    }, []);

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
            <shapeGeometry args={[fairwayShape]} />
            <meshStandardMaterial color="#7cb87c" />
        </mesh>
    );
}

function Terrain() {
    return (
        <>
            {/* Hill 1 - Left side (3D elevated) */}
            <mesh position={[-18, 0.8, 8]}>
                <coneGeometry args={[6, 1.5, 16]} />
                <meshStandardMaterial color="#4a7a4a" />
            </mesh>
            {/* Hill 2 - Right side (3D elevated) */}
            <mesh position={[22, 0.6, 3]}>
                <coneGeometry args={[8, 1.2, 16]} />
                <meshStandardMaterial color="#4a7a4a" />
            </mesh>
            {/* Hill 3 - Behind hole (3D elevated) */}
            <mesh position={[8, 0.5, -38]}>
                <coneGeometry args={[5, 1, 16]} />
                <meshStandardMaterial color="#4a7a4a" />
            </mesh>
            {/* Small bump near turn */}
            <mesh position={[6, 0.3, -5]}>
                <coneGeometry args={[4, 0.6, 16]} />
                <meshStandardMaterial color="#4a7a4a" />
            </mesh>
        </>
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

function Hole() {
    return (
        <group position={[12, 0, -30]}>
            {/* Hole (dark cylinder) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            {/* Flag pole */}
            <mesh position={[0, 1, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
                <meshStandardMaterial color="#654321" />
            </mesh>
            {/* Red flag */}
            <mesh position={[0.1, 1.8, 0]} rotation={[0, 0, -Math.PI / 4]}>
                <planeGeometry args={[0.3, 0.2]} />
                <meshBasicMaterial color={0xff0000} />
            </mesh>
        </group>
    );
}

export default function Scene() {
    // Position trees naturally around the fairway (not in straight lines)
    const treePositions: [number, number, number][] = [
        // Left side trees - natural spacing
        [-10, 0, 32],
        [-9, 0, 25],
        [-11, 0, 18],
        [-8, 0, 10],
        [-10, 0, 2],
        [-9, 0, -8],
        [-11, 0, -18],
        [-8, 0, -28],
        // Right side trees - natural spacing, following the curve
        [10, 0, 32],
        [11, 0, 25],
        [9, 0, 18],
        [12, 0, 10],
        [10, 0, 2],
        [11, 0, -8],
        [13, 0, -18],
        [12, 0, -28],
        // Trees further out for depth and framing
        [-16, 0, 28],
        [-14, 0, 12],
        [-16, 0, -5],
        [18, 0, 28],
        [16, 0, 12],
        [20, 0, -5],
        // Trees near the green
        [5, 0, -28],
        [18, 0, -32],
        [-5, 0, -28],
    ];

    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
            <Ground />
            {treePositions.map((pos, i) => (
                <Tree key={i} position={pos} />
            ))}
            <Hole />
            <Ball />
            <Trajectory />
            <CameraController />
        </>
    );
}

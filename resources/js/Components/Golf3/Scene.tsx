import { useMemo, useRef, useEffect } from 'react';
import { Shape, PlaneGeometry } from 'three';
import Ball from './Ball';
import Trajectory from './Trajectory';
import CameraController from './CameraController';
import { getTerrainHeight } from './terrain';

const terrainMeshRef = { current: null as any };

function Terrain() {
    const terrainRef = useRef<any>(null);
    const terrainGeometry = useMemo(() => {
        const width = 200;
        const depth = 200;
        const segments = 120; // More segments for smoother terrain
        const geometry = new PlaneGeometry(width, depth, segments, segments);
        
        const positions = geometry.attributes.position;
        
        // PlaneGeometry is on XY plane, we rotate it -90° to be on XZ
        // So: getX() = world X, getY() = world Z, we set Z (which becomes world Y)
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const z = positions.getY(i); // This is world Z after rotation
            
            const terrainY = getTerrainHeight(x, z);
            positions.setZ(i, terrainY); // Set Z which becomes world Y after rotation
        }
        
        geometry.computeVertexNormals();
        return geometry;
    }, []);

    // Store ref for ball collision
    useEffect(() => {
        terrainMeshRef.current = terrainRef.current;
    }, []);

    return (
        <mesh ref={terrainRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} geometry={terrainGeometry}>
            <meshStandardMaterial color="#2d5a2d" />
        </mesh>
    );
}

function Fairway() {
    // Fairway that curves to the right and follows terrain using terrain height function
    const fairwayGeometry = useMemo(() => {
        const width = 16;
        const length = 75;
        const segments = 40; // More segments for smoother fairway
        const geometry = new PlaneGeometry(width, length, segments, segments);
        
        const positions = geometry.attributes.position;
        
        for (let i = 0; i < positions.count; i++) {
            const localX = positions.getX(i);
            const localZ = positions.getY(i);
            
            // Map to world coordinates (curved path)
            const t = (localZ + length / 2) / length; // 0 to 1
            const worldZ = 40 - t * 75; // Start at 40, end at -35
            const worldX = localX + t * 5; // Curve to the right
            
            // Use terrain height function
            const terrainY = getTerrainHeight(worldX, worldZ);
            positions.setZ(i, terrainY); // Set Z which becomes world Y after rotation
        }
        
        geometry.computeVertexNormals();
        return geometry;
    }, []);

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} geometry={fairwayGeometry}>
            <meshStandardMaterial color="#6db86d" />
        </mesh>
    );
}

function Green() {
    // Green that follows terrain using terrain height function
    const greenGeometry = useMemo(() => {
        const radius = 6.5;
        const segments = 40; // More segments for smoother green
        const geometry = new PlaneGeometry(radius * 2, radius * 2, segments, segments);
        
        const positions = geometry.attributes.position;
        const greenX = 5;
        const greenZ = -35;
        
        for (let i = 0; i < positions.count; i++) {
            const localX = positions.getX(i);
            const localZ = positions.getY(i);
            
            const worldX = greenX + localX;
            const worldZ = greenZ + localZ;
            
            // Use terrain height function
            const terrainY = getTerrainHeight(worldX, worldZ);
            positions.setZ(i, terrainY); // Set Z which becomes world Y after rotation
        }
        
        geometry.computeVertexNormals();
        return geometry;
    }, []);

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5, 0.002, -35]} geometry={greenGeometry}>
            <meshStandardMaterial color="#90ee90" />
        </mesh>
    );
}

function WaterHazard() {
    // Water hazard that follows terrain (depression is in terrain function)
    const waterGeometry = useMemo(() => {
        const radius = 7;
        const segments = 40; // More segments for smoother water
        const geometry = new PlaneGeometry(radius * 2, radius * 2, segments, segments);
        
        const positions = geometry.attributes.position;
        const waterX = 8;
        const waterZ = 2;
        
        for (let i = 0; i < positions.count; i++) {
            const localX = positions.getX(i);
            const localZ = positions.getY(i);
            
            const worldX = waterX + localX;
            const worldZ = waterZ + localZ;
            
            // Use terrain height function (which includes the depression)
            const terrainY = getTerrainHeight(worldX, worldZ);
            positions.setZ(i, terrainY); // Set Z which becomes world Y after rotation
        }
        
        geometry.computeVertexNormals();
        return geometry;
    }, []);

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[8, 0.001, 2]} geometry={waterGeometry}>
            <meshStandardMaterial color="#4a90e2" />
        </mesh>
    );
}

function TeeBox() {
    // Tee box that follows terrain
    const teeBoxGeometry = useMemo(() => {
        const size = 4;
        const segments = 8;
        const geometry = new PlaneGeometry(size, size, segments, segments);
        
        const positions = geometry.attributes.position;
        const teeX = 0;
        const teeZ = 40;
        
        for (let i = 0; i < positions.count; i++) {
            const localX = positions.getX(i);
            const localZ = positions.getY(i);
            
            const worldX = teeX + localX;
            const worldZ = teeZ + localZ;
            
            // Use terrain height function
            const terrainY = getTerrainHeight(worldX, worldZ);
            positions.setZ(i, terrainY); // Set Z which becomes world Y after rotation
        }
        
        geometry.computeVertexNormals();
        return geometry;
    }, []);

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 40]} geometry={teeBoxGeometry}>
            <meshStandardMaterial color="#7cb87c" />
        </mesh>
    );
}

function Ground() {
    return (
        <>
            {/* 3D Terrain with hills and valleys - single mesh, no z-fighting */}
            <Terrain />
        </>
    );
}

function Tree({ position }: { position: [number, number, number] }) {
    // Trees positioned on terrain
    const treeHeight = getTerrainHeight(position[0], position[2]);
    return (
        <group position={[position[0], treeHeight + 0.5, position[2]]}>
            <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.15, 0.15, 1, 8]} />
                <meshStandardMaterial color="#654321" />
            </mesh>
            <mesh position={[0, 1.8, 0]}>
                <sphereGeometry args={[0.9, 8, 8]} />
                <meshStandardMaterial color="#1a5a1a" />
            </mesh>
        </group>
    );
}

function Mountains() {
    return (
        <>
            <mesh position={[-30, 3, -60]} rotation={[0, 0.3, 0]}>
                <coneGeometry args={[12, 8, 4]} />
                <meshStandardMaterial color="#6b8db8" />
            </mesh>
            <mesh position={[0, 4, -70]} rotation={[0, 0, 0]}>
                <coneGeometry args={[15, 10, 4]} />
                <meshStandardMaterial color="#5a7da8" />
            </mesh>
            <mesh position={[25, 3, -65]} rotation={[0, -0.2, 0]}>
                <coneGeometry args={[10, 7, 4]} />
                <meshStandardMaterial color="#6b8db8" />
            </mesh>
        </>
    );
}

function Hole() {
    // Position hole at bottom of depression
    const holeY = getTerrainHeight(5, -35);
    return (
        <group position={[5, holeY - 0.1, -35]}>
            {/* Hole cylinder - dark inside (bigger to match terrain) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
                <meshStandardMaterial color="#0a0a0a" />
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
    const treePositions: [number, number, number][] = [
        [-10, 0, 35],
        [-12, 0, 28],
        [-9, 0, 20],
        [-11, 0, 12],
        [-10, 0, 4],
        [-12, 0, -4],
        [-9, 0, -12],
        [-11, 0, -20],
        [-10, 0, -28],
        [-12, 0, -35],
        [10, 0, 35],
        [12, 0, 28],
        [9, 0, 20],
        [11, 0, 12],
        [10, 0, 4],
        [12, 0, -4],
        [9, 0, -12],
        [11, 0, -20],
        [10, 0, -28],
        [12, 0, -35],
        [-18, 0, 25],
        [-16, 0, 10],
        [-18, 0, -5],
        [-16, 0, -20],
        [18, 0, 25],
        [16, 0, 10],
        [18, 0, -5],
        [16, 0, -20],
        [6, 0, 2],
        [8, 0, -2],
    ];

    return (
        <>
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
            <Ground />
            <Mountains />
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

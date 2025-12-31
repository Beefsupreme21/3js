import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh, Raycaster, Vector3 } from 'three';
import { useGolf3 } from './Golf3Context';
import { getTerrainHeight } from './terrain';

export default function Ball() {
    const ballRef = useRef<Mesh>(null);
    const { ballPosition, ballVelocity, setBallPosition, setBallVelocity, setIsInHole } = useGolf3();
    const { scene } = useThree();
    const raycaster = useRef(new Raycaster());
    const ballRadius = 0.06;

    useFrame((state, delta) => {
        if (!ballRef.current) return;

        // Apply physics
        const [vx, vy, vz] = ballVelocity;
        
        // Find terrain mesh
        const terrainMesh = scene.children.find((child: any) => 
            child.type === 'Mesh' && child.geometry?.attributes?.position
        ) as any;

        // If ball is not moving, ensure it's on terrain using raycast
        if (vx === 0 && vy === 0 && vz === 0) {
            const [px, pz] = [ballPosition[0], ballPosition[2]];
            let terrainY = getTerrainHeight(px, pz); // Fallback
            
            // Try raycast first
            if (terrainMesh) {
                raycaster.current.set(new Vector3(px, 100, pz), new Vector3(0, -1, 0));
                const intersects = raycaster.current.intersectObject(terrainMesh);
                if (intersects.length > 0) {
                    terrainY = intersects[0].point.y;
                }
            }
            
            const correctY = terrainY + ballRadius + 0.03;
            if (Math.abs(ballPosition[1] - correctY) > 0.01) {
                setBallPosition([px, correctY, pz]);
            }
            ballRef.current.position.set(ballPosition[0], ballPosition[1], ballPosition[2]);
            return;
        }

        const gravity = 9.8;
        const friction = 0.98;
        const bounceDamping = 0.7;

        // Update velocity with gravity
        const newVy = vy - gravity * delta;
        
        // Update position
        const [px, py, pz] = ballPosition;
        const newPx = px + vx * delta;
        const newPy = py + newVy * delta;
        const newPz = pz + vz * delta;

        // Check if ball is in hole
        const holeX = 5;
        const holeZ = -35;
        const holeRadius = 0.4;
        const distToHole = Math.sqrt((newPx - holeX) ** 2 + (newPz - holeZ) ** 2);
        const holeBottomY = getTerrainHeight(holeX, holeZ) - 0.2;
        
        if (distToHole < holeRadius && newPy < holeBottomY + 0.1) {
            // Ball is in the hole!
            setBallVelocity([0, 0, 0]);
            setBallPosition([holeX, holeBottomY, holeZ]);
            ballRef.current.position.set(holeX, holeBottomY, holeZ);
            setIsInHole(true);
            return;
        }
        
        // Terrain collision - use raycast for accurate height
        let terrainY = getTerrainHeight(newPx, newPz); // Fallback
        if (terrainMesh) {
            raycaster.current.set(new Vector3(newPx, 100, newPz), new Vector3(0, -1, 0));
            const intersects = raycaster.current.intersectObject(terrainMesh);
            if (intersects.length > 0) {
                terrainY = intersects[0].point.y;
            }
        }
        
        const groundY = terrainY + ballRadius + 0.03;
        
        if (newPy <= groundY) {
            // Bounce
            const bounceVy = -newVy * bounceDamping;
            const newVx = vx * friction;
            const newVz = vz * friction;
            
            // Stop if velocity is very small
            if (Math.abs(bounceVy) < 0.1 && Math.abs(newVx) < 0.1 && Math.abs(newVz) < 0.1) {
                setBallVelocity([0, 0, 0]);
                setBallPosition([newPx, groundY, newPz]);
                ballRef.current.position.set(newPx, groundY, newPz);
            } else {
                setBallVelocity([newVx, bounceVy, newVz]);
                setBallPosition([newPx, groundY, newPz]);
                ballRef.current.position.set(newPx, groundY, newPz);
            }
        } else {
            setBallVelocity([vx, newVy, vz]);
            setBallPosition([newPx, newPy, newPz]);
            ballRef.current.position.set(newPx, newPy, newPz);
        }
    });

    return (
        <mesh ref={ballRef} position={ballPosition}>
            <sphereGeometry args={[0.06, 32, 32]} />
            <meshStandardMaterial color="#ffffff" />
        </mesh>
    );
}


import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { useGolf2 } from './Golf2Context';

export default function Ball() {
    const ballRef = useRef<Mesh>(null);
    const { ballPosition, ballVelocity, setBallPosition, setBallVelocity } = useGolf2();

    useFrame((state, delta) => {
        if (!ballRef.current) return;

        // Apply physics
        const [vx, vy, vz] = ballVelocity;
        
        // If ball is not moving, don't update
        if (vx === 0 && vy === 0 && vz === 0) {
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

        // Ground collision
        const ballRadius = 0.1;
        const groundY = ballRadius;
        
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
            <sphereGeometry args={[0.1, 32, 32]} />
            <meshStandardMaterial color="#ffffff" />
        </mesh>
    );
}

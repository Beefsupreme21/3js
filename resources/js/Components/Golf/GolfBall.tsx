import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { useGolf } from './GolfContext';

const BALL_RADIUS = 0.1;
const GRAVITY = -9.8;
const FRICTION = 0.95;
const BOUNCE_DAMPING = 0.6;

export default function GolfBall() {
    const meshRef = useRef<Mesh>(null);
    const velocityRef = useRef(new Vector3(0, 0, 0));
    const { isGameStarted } = useGolf();
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<Vector3 | null>(null);
    const [aimLine, setAimLine] = useState<{ start: Vector3; end: Vector3 } | null>(null);
    const { raycaster, mouse, camera } = useThree();

    // Reset ball position when game starts
    useEffect(() => {
        if (isGameStarted && meshRef.current) {
            meshRef.current.position.set(0, BALL_RADIUS, 0);
            velocityRef.current.set(0, 0, 0);
        }
    }, [isGameStarted]);

    // Handle mouse/touch for aiming
    useEffect(() => {
        if (!isGameStarted) return;

        const handleMouseDown = (event: MouseEvent) => {
            if (!meshRef.current) return;
            
            // Convert mouse to world position
            mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
            raycaster.setFromCamera(mouse, camera);
            
            const intersects = raycaster.intersectObject(meshRef.current);
            if (intersects.length > 0) {
                setIsDragging(true);
                setDragStart(new Vector3().copy(meshRef.current.position));
            }
        };

        const handleMouseMove = (event: MouseEvent) => {
            if (!isDragging || !meshRef.current || !dragStart) return;

            mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
            raycaster.setFromCamera(mouse, camera);
            
            // Get intersection with ground plane
            const planeNormal = new Vector3(0, 1, 0);
            const planePoint = new Vector3(0, 0, 0);
            const ray = raycaster.ray;
            
            const denom = planeNormal.dot(ray.direction);
            if (Math.abs(denom) > 0.0001) {
                const t = planeNormal.dot(planePoint.clone().sub(ray.origin)) / denom;
                const intersection = ray.origin.clone().add(ray.direction.clone().multiplyScalar(t));
                
                // Calculate aim direction
                const direction = intersection.clone().sub(dragStart).normalize();
                const distance = Math.min(intersection.distanceTo(dragStart), 5); // Max aim distance
                const endPoint = dragStart.clone().add(direction.multiplyScalar(distance));
                
                setAimLine({ start: dragStart.clone(), end: endPoint });
            }
        };

        const handleMouseUp = () => {
            if (!isDragging || !dragStart || !aimLine) {
                setIsDragging(false);
                setAimLine(null);
                return;
            }

            // Calculate velocity from drag
            const direction = aimLine.end.clone().sub(aimLine.start).normalize();
            const power = Math.min(aimLine.start.distanceTo(aimLine.end), 5) * 2; // Scale power
            
            velocityRef.current.copy(direction.multiplyScalar(power));
            setIsDragging(false);
            setAimLine(null);
        };

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isGameStarted, isDragging, dragStart, aimLine, raycaster, mouse, camera]);

    // Physics update
    useFrame((_, delta) => {
        if (!meshRef.current || !isGameStarted) return;

        const pos = meshRef.current.position;
        const vel = velocityRef.current;

        // Apply gravity
        vel.y += GRAVITY * delta;

        // Update position
        pos.add(vel.clone().multiplyScalar(delta));

        // Ground collision
        if (pos.y <= BALL_RADIUS) {
            pos.y = BALL_RADIUS;
            if (vel.y < 0) {
                vel.y *= -BOUNCE_DAMPING;
                if (Math.abs(vel.y) < 0.1) {
                    vel.y = 0;
                }
            }
        }

        // Apply friction when on ground
        if (pos.y <= BALL_RADIUS + 0.01) {
            vel.x *= FRICTION;
            vel.z *= FRICTION;
            
            // Stop if velocity is very small
            if (vel.length() < 0.1) {
                vel.set(0, 0, 0);
            }
        }
    });

    if (!isGameStarted) return null;

    return (
        <>
            {/* Golf ball */}
            <mesh ref={meshRef} position={[0, BALL_RADIUS, 0]}>
                <sphereGeometry args={[BALL_RADIUS, 16, 16]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>

            {/* Aim line */}
            {aimLine && (
                <line>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={2}
                            array={new Float32Array([
                                aimLine.start.x, aimLine.start.y + 0.1, aimLine.start.z,
                                aimLine.end.x, aimLine.end.y + 0.1, aimLine.end.z,
                            ])}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial color="#ffff00" linewidth={2} />
                </line>
            )}
        </>
    );
}


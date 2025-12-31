import { useMemo } from 'react';
import { BufferGeometry, Vector3 } from 'three';
import { useGolf2 } from './Golf2Context';

const CLUB_CONFIG = {
    wedge: { launchAngle: 0.6, maxSpeed: 15 }, // High arc
    putter: { launchAngle: 0.1, maxSpeed: 8 }, // Low, flat shot
};

export default function Trajectory() {
    const { aimAngle, ballPosition, ballVelocity, targetPower, club } = useGolf2();

    // Only show trajectory when ball is stationary (aiming/charging)
    const isMoving = ballVelocity[0] !== 0 || ballVelocity[1] !== 0 || ballVelocity[2] !== 0;
    if (isMoving) return null;

    // Calculate trajectory based on target power goal and club (not current charging power)
    const geometry = useMemo(() => {
        const points: Vector3[] = [];
        const steps = 50;
        const gravity = 9.8;
        const clubConfig = CLUB_CONFIG[club];
        // Use target power for trajectory visualization
        const speed = (targetPower / 100) * clubConfig.maxSpeed;
        const launchAngle = clubConfig.launchAngle;
        
        // Calculate initial velocity components
        const vx = Math.sin(aimAngle) * speed * Math.cos(launchAngle);
        const vz = -Math.cos(aimAngle) * speed * Math.cos(launchAngle);
        const vy = speed * Math.sin(launchAngle);
        
        // Calculate time to ground (when y = 0)
        const timeToGround = (2 * vy) / gravity;
        const maxTime = Math.max(timeToGround, 1);
        
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * maxTime;
            // Projectile motion equations
            const x = vx * t;
            const z = vz * t;
            const y = vy * t - 0.5 * gravity * t * t;
            
            // Stop if below ground
            if (y < 0) break;
            
            points.push(new Vector3(x, Math.max(0, y), z));
        }
        
        return new BufferGeometry().setFromPoints(points);
    }, [aimAngle, targetPower, club]);

    return (
        <group position={ballPosition}>
            <line geometry={geometry}>
                <lineBasicMaterial color={0xff0000} />
            </line>
        </group>
    );
}


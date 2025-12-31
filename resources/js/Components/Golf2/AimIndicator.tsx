import { useMemo, useRef, useEffect } from 'react';
import { CatmullRomCurve3, Vector3, TubeGeometry } from 'three';
import { useGolf2 } from './Golf2Context';

export default function AimIndicator() {
    const { aimAngle, power, isPowerMeterActive, ballPosition, ballVelocity, club } = useGolf2();
    const geometryRef = useRef<TubeGeometry | null>(null);
    const lastValuesRef = useRef({ aimAngle: 0, power: 0, club: '', isPowerMeterActive: false });

    // Calculate direction vector - memoize to prevent constant recalculation
    const directionX = useMemo(() => Math.sin(aimAngle), [aimAngle]);
    const directionZ = useMemo(() => -Math.cos(aimAngle), [aimAngle]);
    
    // Club-specific launch angles
    const launchAngle = useMemo(() => {
        const launchAngles: Record<string, number> = {
            putter: 0.1,
            driver: 0.4,
            wedge: 0.6,
        };
        return launchAngles[club] || 0.1;
    }, [club]);

    // Only show indicator when ball is not moving
    const isBallMoving = ballVelocity[0] !== 0 || ballVelocity[1] !== 0 || ballVelocity[2] !== 0;

    // Round power to reduce updates - only update every 5%
    const roundedPower = useMemo(() => Math.floor(power / 5) * 5, [power]);

    // Calculate proper parabolic arc trajectory - make it LONG and visible
    const trajectoryCurve = useMemo(() => {
        const points: Vector3[] = [];
        const steps = 80;
        
        // Estimate initial velocity based on power (for visualization)
        const estimatedPower = isPowerMeterActive ? roundedPower : 50;
        const initialSpeed = (estimatedPower / 100) * 20;
        
        // Calculate trajectory using physics
        const vx = directionX * initialSpeed * Math.cos(launchAngle);
        const vz = directionZ * initialSpeed * Math.cos(launchAngle);
        const vy = initialSpeed * Math.sin(launchAngle);
        const gravity = 9.8;
        
        // Calculate time until ball hits ground
        const timeToGround = (2 * vy) / gravity;
        const maxTime = Math.max(timeToGround * 2, 3);
        
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * maxTime;
            
            // Parabolic trajectory equations
            const x = vx * t;
            const z = vz * t;
            const y = vy * t - 0.5 * gravity * t * t;
            
            // Stop if below ground
            if (y < 0) break;
            
            points.push(new Vector3(x, Math.max(0, y), z));
        }
        
        return new CatmullRomCurve3(points);
    }, [directionX, directionZ, roundedPower, isPowerMeterActive, launchAngle]);

    // Only update geometry when values actually change
    useEffect(() => {
        const hasChanged = 
            lastValuesRef.current.aimAngle !== aimAngle ||
            lastValuesRef.current.roundedPower !== roundedPower ||
            lastValuesRef.current.club !== club ||
            lastValuesRef.current.isPowerMeterActive !== isPowerMeterActive;
        
        if (hasChanged && trajectoryCurve.points.length > 0) {
            if (geometryRef.current) {
                geometryRef.current.dispose();
            }
            geometryRef.current = new TubeGeometry(trajectoryCurve, 80, 0.2, 8, false);
            lastValuesRef.current = { aimAngle, power: roundedPower, club, isPowerMeterActive };
        }
    }, [aimAngle, roundedPower, club, isPowerMeterActive, trajectoryCurve]);

    if (isBallMoving || !geometryRef.current) return null;

    const groupPosition = useMemo(() => [ballPosition[0], ballPosition[1] + 0.15, ballPosition[2]] as [number, number, number], [ballPosition[0], ballPosition[1], ballPosition[2]]);

    return (
        <group position={groupPosition}>
            {/* Thick RED tube for trajectory - NO FLASHING */}
            <mesh geometry={geometryRef.current}>
                <meshBasicMaterial color={0xff0000} />
            </mesh>
        </group>
    );
}


import { createContext, useContext, useState, ReactNode, useEffect, useRef, useCallback } from 'react';
import { getTerrainHeight } from './terrain';

export type ClubType = 'wedge' | 'putter';

interface Golf3ContextType {
    isGameStarted: boolean;
    startGame: () => void;
    aimAngle: number;
    power: number;
    targetPower: number;
    club: ClubType;
    setClub: (club: ClubType) => void;
    isCharging: boolean;
    startPowerMeter: () => void;
    stopPowerMeter: () => void;
    ballPosition: [number, number, number];
    ballVelocity: [number, number, number];
    setBallPosition: (pos: [number, number, number]) => void;
    setBallVelocity: (vel: [number, number, number]) => void;
    resetBall: () => void;
    isInHole: boolean;
    setIsInHole: (value: boolean) => void;
}

const Golf3Context = createContext<Golf3ContextType | null>(null);

// Club configurations
const CLUB_CONFIG = {
    wedge: { launchAngle: 0.6, maxSpeed: 15 }, // High arc
    putter: { launchAngle: 0.1, maxSpeed: 8 }, // Low, flat shot
};

export function Golf3Provider({ children }: { children: ReactNode }) {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [aimAngle, setAimAngle] = useState(0); // Angle in radians
    const [power, setPower] = useState(0);
    const [targetPower, setTargetPower] = useState(75); // Target power goal (default 75%)
    const [club, setClub] = useState<ClubType>('wedge'); // Default to wedge
    const [isCharging, setIsCharging] = useState(false);
    // Spawn on tee box (elevated)
    const spawnX = 0;
    const spawnZ = 40;
    const spawnTerrainY = getTerrainHeight(spawnX, spawnZ);
    const [ballPosition, setBallPosition] = useState<[number, number, number]>([spawnX, spawnTerrainY + 0.09, spawnZ]); // Spawn on tee box (ball radius 0.06 + 0.03 clearance)
    const [ballVelocity, setBallVelocity] = useState<[number, number, number]>([0, 0, 0]);
    const [isInHole, setIsInHole] = useState(false);
    const chargeStartTimeRef = useRef<number | null>(null);
    const powerRef = useRef(0);

    const startGame = () => {
        setIsGameStarted(true);
        resetBall();
    };

    const resetBall = () => {
        const terrainY = getTerrainHeight(spawnX, spawnZ);
        setBallPosition([spawnX, terrainY + 0.09, spawnZ]); // Reset to spawn position on terrain
        setBallVelocity([0, 0, 0]);
        setPower(0);
        setAimAngle(0);
        setTargetPower(75); // Reset target power to default
        setClub('wedge'); // Reset to wedge
        setIsInHole(false);
    };

    const startPowerMeter = useCallback(() => {
        if (!isGameStarted || isCharging) return;
        setIsCharging(true);
        chargeStartTimeRef.current = performance.now();
        setPower(0);
        powerRef.current = 0;
    }, [isGameStarted, isCharging]);

    const stopPowerMeter = useCallback(() => {
        if (!isCharging) return;
        setIsCharging(false);
        chargeStartTimeRef.current = null;
        
        // Hit the ball with current power and aim angle
        // Use powerRef.current to get the latest power value
        const currentPower = powerRef.current;
        if (currentPower > 0) {
            const clubConfig = CLUB_CONFIG[club];
            const speed = (currentPower / 100) * clubConfig.maxSpeed;
            const launchAngle = clubConfig.launchAngle;
            
            // Calculate velocity based on aim angle and power
            const vx = Math.sin(aimAngle) * speed * Math.cos(launchAngle);
            const vz = -Math.cos(aimAngle) * speed * Math.cos(launchAngle);
            const vy = speed * Math.sin(launchAngle);
            
            setBallVelocity([vx, vy, vz]);
            console.log('Ball hit!', { power: currentPower, club, speed, vx, vy, vz });
        }
    }, [isCharging, aimAngle, club]);

    // Handle keyboard input
    useEffect(() => {
        if (!isGameStarted) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                setAimAngle((prev) => prev + 0.1); // Rotate left
            } else if (e.key === 'ArrowRight') {
                setAimAngle((prev) => prev - 0.1); // Rotate right
            } else if (e.key === 'ArrowUp') {
                setTargetPower((prev) => Math.min(100, prev + 5)); // Increase target power
            } else if (e.key === 'ArrowDown') {
                setTargetPower((prev) => Math.max(0, prev - 5)); // Decrease target power
            } else if (e.key === '1' || e.key === 'q' || e.key === 'Q') {
                setClub('wedge');
            } else if (e.key === '2' || e.key === 'w' || e.key === 'W') {
                setClub('putter');
            } else if (e.key === ' ' || e.key === 'Space') {
                e.preventDefault();
                startPowerMeter();
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === ' ' || e.key === 'Space') {
                e.preventDefault();
                stopPowerMeter();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isGameStarted, startPowerMeter, stopPowerMeter]);

    // Update power in useFrame (exposed via ref for smooth updates)
    useEffect(() => {
        if (!isCharging) return;

        const interval = setInterval(() => {
            if (chargeStartTimeRef.current === null) return;
            
            const elapsed = (performance.now() - chargeStartTimeRef.current) / 1000; // seconds
            const chargeTime = 2; // 2 seconds to fill
            const newPower = Math.min(100, (elapsed / chargeTime) * 100);
            
            powerRef.current = newPower;
            setPower(newPower);
        }, 16); // ~60fps

        return () => clearInterval(interval);
    }, [isCharging]);

    return (
        <Golf3Context.Provider
            value={{
                isGameStarted,
                startGame,
                aimAngle,
                power,
                targetPower,
                club,
                setClub,
                isCharging,
                startPowerMeter,
                stopPowerMeter,
                ballPosition,
                ballVelocity,
                setBallPosition,
                setBallVelocity,
                resetBall,
                isInHole,
                setIsInHole,
            }}
        >
            {children}
        </Golf3Context.Provider>
    );
}

export function useGolf3() {
    const context = useContext(Golf3Context);
    if (!context) {
        throw new Error('useGolf3 must be used within a Golf3Provider');
    }
    return context;
}


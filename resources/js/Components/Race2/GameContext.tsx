import { createContext, useContext, useRef, useState, ReactNode, useCallback } from 'react';
import { Vector3 } from 'three';

interface GameContextType {
    playerPosition: React.MutableRefObject<Vector3>;
    currentSpeed: React.MutableRefObject<number>;
    gear: number;
    shiftUp: () => void;
    shiftDown: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

// Max speeds for each gear (in base units per second)
// These are the target speeds that the car will gradually accelerate to
const GEAR_MAX_SPEEDS: Record<number, number> = {
    1: 7.2,   // ~36 MPH max
    2: 12.0,  // ~60 MPH max (starting gear)
    3: 16.8,  // ~84 MPH max
    4: 24.0,  // ~120 MPH max
    5: 30.0,  // ~150 MPH max
};

export function GameProvider({ children }: { children: ReactNode }) {
    const playerPosition = useRef(new Vector3(0, 0.5, 0));
    const currentSpeed = useRef(12.0); // Start at gear 2's max speed
    const [gear, setGear] = useState(2); // Start in gear 2

    const shiftUp = useCallback(() => {
        setGear((current) => Math.min(5, current + 1));
    }, []);

    const shiftDown = useCallback(() => {
        setGear((current) => Math.max(1, current - 1));
    }, []);

    return (
        <GameContext.Provider
            value={{
                playerPosition,
                currentSpeed,
                gear,
                shiftUp,
                shiftDown,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}

// Export gear max speed function
export function getGearMaxSpeed(gear: number): number {
    return GEAR_MAX_SPEEDS[gear] || 12.0;
}

// Export gear multiplier function for use in other components
export function getGearMultiplier(gear: number): number {
    return GEAR_MULTIPLIERS[gear] || 1.0;
}

export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}

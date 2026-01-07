import { useState, useEffect, useCallback, useRef } from 'react';
import Obstacle, { ObstacleType } from './Obstacle';
import { useGame, getGearMultiplier } from './GameContext';

interface ObstacleData {
    id: number;
    position: [number, number, number];
    type: ObstacleType;
}

const SPAWN_Z = -60;
const BASE_OBSTACLE_SPEED = 12;

// Level scaling
const LEVEL_CONFIG = {
    1: { 
        speedMultiplier: 1.15,
        spawnInterval: 2000,     // Bit tighter now
        mode: 'tutorial',        // Few small obstacles, easy
    },
    2: { 
        speedMultiplier: 1.25,
        spawnInterval: 1800,
        mode: 'normal',          // Complex walls + cylinders
    },
    3: { 
        speedMultiplier: 1.67,
        spawnInterval: 1600,
        mode: 'hard',            // More cylinders, faster
    },
};

export default function ObstacleManager() {
    const [obstacles, setObstacles] = useState<ObstacleData[]>([]);
    const [nextId, setNextId] = useState(0);
    const spawnCountRef = useRef(0);
    const { isGameStarted, isGameOver, currentSpeed, level } = useGame();

    const config = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG] || LEVEL_CONFIG[1];
    // Use actual current speed instead of theoretical max
    const obstacleSpeed = currentSpeed.current * config.speedMultiplier;

    // Clear all obstacles when game restarts
    useEffect(() => {
        if (!isGameOver && isGameStarted) {
            setObstacles([]);
            setNextId(0);
            spawnCountRef.current = 0;
        }
    }, [isGameOver, isGameStarted]);

    // Spawn obstacles on main timer
    useEffect(() => {
        if (!isGameStarted || isGameOver) return;

        const interval = setInterval(() => {
            const newObstacles: ObstacleData[] = [];
            let currentId = nextId;
            spawnCountRef.current += 1;

            if (config.mode === 'tutorial') {
                // LEVEL 1: Few small obstacles - dodge OR jump
                const roll = Math.random();
                const xPos = (Math.random() - 0.5) * 12; // Random position
                
                if (roll < 0.5) {
                    // Small block - can jump or dodge
                    newObstacles.push({
                        id: currentId++,
                        position: [xPos, 0.6, SPAWN_Z],
                        type: 'simple_bar',
                    });
                } else {
                    // Single cylinder
                    newObstacles.push({
                        id: currentId++,
                        position: [xPos, 2, SPAWN_Z],
                        type: 'cylinder',
                    });
                }
            } else if (config.mode === 'normal') {
                // LEVEL 2: Easy walls (bigger gaps) + some cylinders
                const roll = Math.random();
                
                if (roll < 0.7) {
                    const gapIndex = Math.floor(Math.random() * 8);
                    newObstacles.push({
                        id: currentId++,
                        position: [0, gapIndex, SPAWN_Z],
                        type: 'easy_wall', // Bigger gap for level 2
                    });
                } else {
                    // 2-3 cylinders
                    const numCylinders = 2 + Math.floor(Math.random() * 2);
                    const usedPositions: number[] = [];
                    
                    for (let i = 0; i < numCylinders; i++) {
                        let xPos: number;
                        let attempts = 0;
                        do {
                            xPos = (Math.random() - 0.5) * 14;
                            attempts++;
                        } while (usedPositions.some((pos) => Math.abs(pos - xPos) < 2.5) && attempts < 10);
                        
                        if (attempts < 10) {
                            usedPositions.push(xPos);
                            newObstacles.push({
                                id: currentId++,
                                position: [xPos, 2, SPAWN_Z + (Math.random() * 4 - 2)],
                                type: 'cylinder',
                            });
                        }
                    }
                }
            } else {
                // LEVEL 3: Harder walls + more cylinders
                const roll = Math.random();
                
                if (roll < 0.6) {
                    const gapIndex = Math.floor(Math.random() * 8);
                    newObstacles.push({
                        id: currentId++,
                        position: [0, gapIndex, SPAWN_Z],
                        type: 'low_bar',
                    });
                } else {
                    // 3-5 cylinders
                    const numCylinders = 3 + Math.floor(Math.random() * 3);
                    const usedPositions: number[] = [];
                    
                    for (let i = 0; i < numCylinders; i++) {
                        let xPos: number;
                        let attempts = 0;
                        do {
                            xPos = (Math.random() - 0.5) * 14;
                            attempts++;
                        } while (usedPositions.some((pos) => Math.abs(pos - xPos) < 2.5) && attempts < 10);
                        
                        if (attempts < 10) {
                            usedPositions.push(xPos);
                            newObstacles.push({
                                id: currentId++,
                                position: [xPos, 2, SPAWN_Z + (Math.random() * 4 - 2)],
                                type: 'cylinder',
                            });
                        }
                    }
                }
            }

            setObstacles((prev) => [...prev, ...newObstacles]);
            setNextId(currentId);
        }, config.spawnInterval);

        return () => clearInterval(interval);
    }, [nextId, isGameStarted, isGameOver, config]);

    // Spawn gates between obstacles (1.5, 3.5, 5.5...)
    useEffect(() => {
        if (!isGameStarted || isGameOver) return;

        let gateInterval: NodeJS.Timeout | null = null;
        const gateOffset = config.spawnInterval / 2;

        // Start gate timer offset by half interval
        const timeout = setTimeout(() => {
            gateInterval = setInterval(() => {
                // Only spawn gate every other gap (1.5, 3.5, 5.5, not 2.5, 4.5)
                if (spawnCountRef.current % 2 === 1) {
                    const archX = (Math.random() - 0.5) * 12;
                    setObstacles((prev) => [
                        ...prev,
                        {
                            id: Date.now() + Math.random(),
                            position: [archX, 1, SPAWN_Z],
                            type: 'arch',
                        },
                    ]);
                }
            }, config.spawnInterval);
        }, gateOffset);

        return () => {
            clearTimeout(timeout);
            if (gateInterval) clearInterval(gateInterval);
        };
    }, [isGameStarted, isGameOver, config]);

    const handleObstaclePassed = useCallback((id: number) => {
        setObstacles((prev) => prev.filter((o) => o.id !== id));
    }, []);

    return (
        <>
            {obstacles.map((obstacle) => (
                <Obstacle
                    key={obstacle.id}
                    position={obstacle.position}
                    onPassed={() => handleObstaclePassed(obstacle.id)}
                    speed={obstacleSpeed}
                    type={obstacle.type}
                />
            ))}
        </>
    );
}

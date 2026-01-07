import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3, Group } from 'three';
import { useGame } from './GameContext';
import { playGateSound } from './sounds';

// Neon ring component for pillars
function NeonRing({ y, radius, color }: { y: number; radius: number; color: string }) {
    return (
        <mesh position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[radius, 0.05, 8, 32]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={2}
                transparent
                opacity={0.9}
            />
        </mesh>
    );
}

type ObstacleType = 'cylinder' | 'low_bar' | 'easy_wall' | 'high_bar' | 'arch' | 'simple_bar';

interface ObstacleProps {
    position: [number, number, number];
    onPassed: () => void;
    speed: number;
    type: ObstacleType;
}

const COLLISION_DISTANCE = 1.2;
const BAR_COLLISION_X = 4;
const ARCH_WIDTH = 5;

export default function Obstacle({ position, onPassed, speed, type }: ObstacleProps) {
    const meshRef = useRef<Mesh>(null);
    const groupRef = useRef<Group>(null);
    const hasPassed = useRef(false);
    const hasCollided = useRef(false);
    const [archHit, setArchHit] = useState(false);
    const [archChecked, setArchChecked] = useState(false);
    const { playerPosition, triggerExplosion, isGameOver, incrementScore, collectGate } = useGame();

    useFrame((_, delta) => {
        const ref = (type === 'arch' || type === 'high_bar' || type === 'low_bar' || type === 'easy_wall') ? groupRef.current : meshRef.current;
        if (!ref || isGameOver) return;

        // Move obstacle toward player (positive Z)
        ref.position.z += speed * delta;

        // Collision for simple block (jump OR dodge around)
        if (type === 'simple_bar' && !hasCollided.current) {
            const obstaclePos = ref.position;
            const playerPos = playerPosition.current;

            const dx = Math.abs(obstaclePos.x - playerPos.x);
            const dz = Math.abs(obstaclePos.z - playerPos.z);
            const isInXRange = dx < 2; // Small block width
            const isInZRange = dz < 1.2;
            const isJumping = playerPos.y > 1.8;

            if (isInXRange && isInZRange && !isJumping) {
                hasCollided.current = true;
                triggerExplosion(new Vector3(playerPos.x, playerPos.y, playerPos.z));
            }
        }

        // Collision detection for cylinders
        if (type === 'cylinder' && !hasCollided.current) {
            const obstaclePos = ref.position;
            const playerPos = playerPosition.current;

            const dx = obstaclePos.x - playerPos.x;
            const dz = obstaclePos.z - playerPos.z;
            const distance = Math.sqrt(dx * dx + dz * dz);

            if (distance < COLLISION_DISTANCE) {
                hasCollided.current = true;
                triggerExplosion(new Vector3(playerPos.x, playerPos.y, playerPos.z));
            }
        }

        // Collision for easy wall (bigger gap)
        if (type === 'easy_wall' && !hasCollided.current) {
            const obstaclePos = ref.position;
            const playerPos = playerPosition.current;

            const dz = Math.abs(obstaclePos.z - playerPos.z);
            const isInZRange = dz < 1.5;
            
            if (isInZRange) {
                const gapIndex = Math.floor(position[1]) % 8;
                const gapX = (gapIndex - 4) * 1.5;
                const gapWidth = 6; // Twice as wide!
                const gapOnTop = gapIndex >= 4;
                
                const isInGapX = Math.abs(playerPos.x - gapX) < gapWidth / 2;
                
                let collision = false;
                
                if (gapOnTop) {
                    const isJumping = playerPos.y > 2.2;
                    if (isJumping && isInGapX) {
                        collision = false;
                    } else if (isJumping && !isInGapX) {
                        collision = true;
                    } else {
                        collision = true;
                    }
                } else {
                    const isOnGround = playerPos.y < 1.5;
                    if (isOnGround && isInGapX) {
                        collision = false;
                    } else if (!isOnGround) {
                        collision = true;
                    } else {
                        collision = true;
                    }
                }
                
                if (collision) {
                    hasCollided.current = true;
                    triggerExplosion(new Vector3(playerPos.x, playerPos.y, playerPos.z));
                }
            }
        }

        // Collision for wall with gap (either top or bottom)
        if (type === 'low_bar' && !hasCollided.current) {
            const obstaclePos = ref.position;
            const playerPos = playerPosition.current;

            const dz = Math.abs(obstaclePos.z - playerPos.z);
            const isInZRange = dz < 1.5;
            
            if (isInZRange) {
                const gapIndex = Math.floor(position[1]) % 8;
                const gapX = (gapIndex - 4) * 1.5;
                const gapWidth = 3;
                const gapOnTop = gapIndex >= 4;
                
                const isInGapX = Math.abs(playerPos.x - gapX) < gapWidth / 2;
                
                // If gap on top: need to jump into gap (y > 2), else hit bottom bar
                // If gap on bottom: need to stay low (y < 2) in gap, else hit top bar
                let collision = false;
                
                if (gapOnTop) {
                    // Gap is on top - must jump AND be in the right X position
                    const isJumping = playerPos.y > 2.2;
                    if (isJumping && isInGapX) {
                        collision = false; // Safe - jumped through gap
                    } else if (isJumping && !isInGapX) {
                        collision = true; // Hit top bar while jumping
                    } else {
                        collision = true; // Hit bottom bar (not jumping)
                    }
                } else {
                    // Gap is on bottom - must stay low AND be in the right X position
                    const isOnGround = playerPos.y < 1.5;
                    if (isOnGround && isInGapX) {
                        collision = false; // Safe - drove through gap
                    } else if (!isOnGround) {
                        collision = true; // Hit top bar (jumping)
                    } else {
                        collision = true; // Hit bottom bar (wrong X)
                    }
                }
                
                if (collision) {
                    hasCollided.current = true;
                    triggerExplosion(new Vector3(playerPos.x, playerPos.y, playerPos.z));
                }
            }
        }

        // Collision for high bar (drive under it)
        if (type === 'high_bar' && !hasCollided.current) {
            const obstaclePos = ref.position;
            const playerPos = playerPosition.current;

            const dx = Math.abs(obstaclePos.x - playerPos.x);
            const dz = Math.abs(obstaclePos.z - playerPos.z);
            const isInXRange = dx < BAR_COLLISION_X;
            const isInZRange = dz < 1.5;
            const isBelowObstacle = playerPos.y < 2.0; // Stay low to pass under

            if (isInXRange && isInZRange && !isBelowObstacle) {
                hasCollided.current = true;
                triggerExplosion(new Vector3(playerPos.x, playerPos.y, playerPos.z));
            }
        }

        // Check arch pass-through at the right moment (circular ring)
        if (type === 'arch' && !archChecked && ref.position.z > 0 && ref.position.z < 2) {
            const playerX = playerPosition.current.x;
            const playerY = playerPosition.current.y;
            const archX = ref.position.x;
            const archY = ref.position.y; // Y position of the ring (should be around 1)
            const ringRadius = 2.5;
            const passRadius = 2.2; // Slightly smaller to account for ring thickness
            
            // Check if player is within the circular ring (vertical hoop)
            const dx = playerX - archX;
            const dy = playerY - archY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const wentThrough = distance < passRadius;
            
            setArchHit(wentThrough);
            setArchChecked(true);

            if (wentThrough) {
                playGateSound();
                collectGate();
            }
        }

        // Check if passed the player
        if (ref.position.z > 3 && !hasPassed.current && !hasCollided.current) {
            hasPassed.current = true;

            if (type !== 'arch') {
                incrementScore();
            }

            onPassed();
        }
    });

    if (isGameOver && hasCollided.current) return null;

    // Render simple block (jump OR dodge) - level 1, pink to match track
    if (type === 'simple_bar') {
        return (
            <group ref={meshRef} position={position}>
                <mesh>
                    <boxGeometry args={[3, 1.5, 1.5]} />
                    <meshStandardMaterial
                        color="#ff00ff"
                        emissive="#ff00ff"
                        emissiveIntensity={0.6}
                        metalness={0.8}
                        roughness={0.2}
                        transparent
                        opacity={0.75}
                    />
                </mesh>
            </group>
        );
    }

    // Render cylinder pillar (dodge around) - neon pillar with rings
    if (type === 'cylinder') {
        return (
            <group ref={meshRef} position={position}>
                {/* Main cylinder - glass look */}
                <mesh>
                    <cylinderGeometry args={[0.6, 0.6, 4, 16]} />
                    <meshStandardMaterial
                        color="#110022"
                        emissive="#ff00ff"
                        emissiveIntensity={0.2}
                        metalness={0.9}
                        roughness={0.1}
                        transparent
                        opacity={0.6}
                    />
                </mesh>
                {/* Neon rings around pillar */}
                <NeonRing y={-1.5} radius={0.75} color="#ff00ff" />
                <NeonRing y={-0.5} radius={0.75} color="#00ffff" />
                <NeonRing y={0.5} radius={0.75} color="#ff00ff" />
                <NeonRing y={1.5} radius={0.75} color="#00ffff" />
                {/* Top cap glow */}
                <mesh position={[0, 2, 0]}>
                    <cylinderGeometry args={[0.7, 0.7, 0.1, 16]} />
                    <meshStandardMaterial
                        color="#ff00ff"
                        emissive="#ff00ff"
                        emissiveIntensity={2}
                    />
                </mesh>
                {/* Bottom cap glow */}
                <mesh position={[0, -2, 0]}>
                    <cylinderGeometry args={[0.7, 0.7, 0.1, 16]} />
                    <meshStandardMaterial
                        color="#00ffff"
                        emissive="#00ffff"
                        emissiveIntensity={2}
                    />
                </mesh>
            </group>
        );
    }

    // Render easy wall - bigger gap for level 2, clean glass style
    if (type === 'easy_wall') {
        const gapIndex = Math.floor(position[1]) % 8;
        const gapX = (gapIndex - 4) * 1.5;
        const gapWidth = 6;
        const trackHalfWidth = 9;
        const gapOnTop = gapIndex >= 4;
        
        const leftWidth = (gapX - gapWidth / 2) - (-trackHalfWidth);
        const leftCenter = -trackHalfWidth + leftWidth / 2;
        const rightWidth = trackHalfWidth - (gapX + gapWidth / 2);
        const rightCenter = trackHalfWidth - rightWidth / 2;
        
        // Level 2: Cyan to match track
        const WallBlock = ({ pos, size }: { pos: [number, number, number]; size: [number, number, number] }) => (
            <mesh position={pos}>
                <boxGeometry args={size} />
                <meshStandardMaterial
                    color="#00ccff"
                    emissive="#00ccff"
                    emissiveIntensity={0.5}
                    metalness={0.8}
                    roughness={0.2}
                    transparent
                    opacity={0.8}
                />
            </mesh>
        );
        
        return (
            <group ref={groupRef} position={[position[0], 1, position[2]]}>
                {gapOnTop ? (
                    <WallBlock pos={[0, 0, 0]} size={[trackHalfWidth * 2, 2, 2]} />
                ) : (
                    <>
                        {leftWidth > 0.5 && <WallBlock pos={[leftCenter, 0, 0]} size={[leftWidth, 2, 2]} />}
                        {rightWidth > 0.5 && <WallBlock pos={[rightCenter, 0, 0]} size={[rightWidth, 2, 2]} />}
                    </>
                )}
                {gapOnTop ? (
                    <>
                        {leftWidth > 0.5 && <WallBlock pos={[leftCenter, 2, 0]} size={[leftWidth, 2, 2]} />}
                        {rightWidth > 0.5 && <WallBlock pos={[rightCenter, 2, 0]} size={[rightWidth, 2, 2]} />}
                    </>
                ) : (
                    <WallBlock pos={[0, 2, 0]} size={[trackHalfWidth * 2, 2, 2]} />
                )}
            </group>
        );
    }

    // Render wall with gap - level 3 harder version, green to match track
    if (type === 'low_bar') {
        const gapIndex = Math.floor(position[1]) % 8;
        const gapX = (gapIndex - 4) * 1.5;
        const gapWidth = 3;
        const trackHalfWidth = 9;
        const gapOnTop = gapIndex >= 4;
        
        const leftWidth = (gapX - gapWidth / 2) - (-trackHalfWidth);
        const leftCenter = -trackHalfWidth + leftWidth / 2;
        const rightWidth = trackHalfWidth - (gapX + gapWidth / 2);
        const rightCenter = trackHalfWidth - rightWidth / 2;
        
        // Level 3: Green to match track
        const WallBlock = ({ pos, size }: { pos: [number, number, number]; size: [number, number, number] }) => (
            <mesh position={pos}>
                <boxGeometry args={size} />
                <meshStandardMaterial
                    color="#00ff44"
                    emissive="#00ff44"
                    emissiveIntensity={0.5}
                    metalness={0.8}
                    roughness={0.2}
                    transparent
                    opacity={0.8}
                />
            </mesh>
        );
        
        return (
            <group ref={groupRef} position={[position[0], 1, position[2]]}>
                {gapOnTop ? (
                    <WallBlock pos={[0, 0, 0]} size={[trackHalfWidth * 2, 2, 2]} />
                ) : (
                    <>
                        {leftWidth > 0.5 && <WallBlock pos={[leftCenter, 0, 0]} size={[leftWidth, 2, 2]} />}
                        {rightWidth > 0.5 && <WallBlock pos={[rightCenter, 0, 0]} size={[rightWidth, 2, 2]} />}
                    </>
                )}
                {gapOnTop ? (
                    <>
                        {leftWidth > 0.5 && <WallBlock pos={[leftCenter, 2, 0]} size={[leftWidth, 2, 2]} />}
                        {rightWidth > 0.5 && <WallBlock pos={[rightCenter, 2, 0]} size={[rightWidth, 2, 2]} />}
                    </>
                ) : (
                    <WallBlock pos={[0, 2, 0]} size={[trackHalfWidth * 2, 2, 2]} />
                )}
            </group>
        );
    }

    // Render drive-under structure - two bottom blocks with big block on top
    if (type === 'high_bar') {
        const blockColor = "#ffcc00";
        const blockEmissive = "#ffaa00";
        
        return (
            <group ref={groupRef} position={position}>
                {/* Left bottom block - sitting on ground */}
                <mesh position={[-3, 0, 0]}>
                    <boxGeometry args={[2, 2, 2]} />
                    <meshStandardMaterial color={blockColor} emissive={blockEmissive} emissiveIntensity={0.6} metalness={0.5} roughness={0.3} />
                </mesh>
                
                {/* Right bottom block - sitting on ground */}
                <mesh position={[3, 0, 0]}>
                    <boxGeometry args={[2, 2, 2]} />
                    <meshStandardMaterial color={blockColor} emissive={blockEmissive} emissiveIntensity={0.6} metalness={0.5} roughness={0.3} />
                </mesh>
                
                {/* Big block on top spanning across */}
                <mesh position={[0, 2, 0]}>
                    <boxGeometry args={[8, 2, 2]} />
                    <meshStandardMaterial color={blockColor} emissive={blockEmissive} emissiveIntensity={0.8} metalness={0.5} roughness={0.3} />
                </mesh>
            </group>
        );
    }

    // Render arch (drive through for gates) - circular ring style
    if (type === 'arch') {
        // More dramatic color change
        const baseColor = !archChecked ? '#00ff88' : archHit ? '#00ffff' : '#ff0044';
        const glowIntensity = !archChecked ? 1.5 : archHit ? 5 : 2; // Much brighter when passed
        const ringSize = !archChecked ? 2.5 : archHit ? 2.7 : 2.5; // Slightly bigger when passed

        return (
            <group ref={groupRef} position={position}>
                {/* Main circular ring - vertical hoop */}
                <mesh rotation={[0, 0, Math.PI / 2]}>
                    <torusGeometry args={[ringSize, 0.2, 16, 32]} />
                    <meshStandardMaterial
                        color={baseColor}
                        emissive={baseColor}
                        emissiveIntensity={glowIntensity}
                    />
                </mesh>
                
                {/* Inner glow ring for extra effect */}
                <mesh rotation={[0, 0, Math.PI / 2]}>
                    <torusGeometry args={[ringSize, 0.08, 16, 32]} />
                    <meshStandardMaterial
                        color={baseColor}
                        emissive={baseColor}
                        emissiveIntensity={glowIntensity * 1.5}
                        transparent
                        opacity={0.7}
                    />
                </mesh>
                
                {/* Extra bright outer ring when passed */}
                {archChecked && archHit && (
                    <mesh rotation={[0, 0, Math.PI / 2]}>
                        <torusGeometry args={[2.9, 0.05, 16, 32]} />
                        <meshStandardMaterial
                            color="#00ffff"
                            emissive="#00ffff"
                            emissiveIntensity={8}
                            transparent
                            opacity={0.9}
                        />
                    </mesh>
                )}
            </group>
        );
    }

    return null;
}

export type { ObstacleType };

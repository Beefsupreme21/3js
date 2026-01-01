import { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { CharacterType } from '../Path2Context';
import { EnemyType } from '../Types/Character';

// Get default attack type for each character
const getCharacterAttackType = (characterType: CharacterType): 'melee' | 'ranged' => {
    switch (characterType) {
        case 'warrior':
            return 'melee';
        case 'hunter':
        case 'mage':
        case 'warlock':
        case 'priest':
            return 'ranged';
        default:
            return 'ranged';
    }
};

// Get attack range for each attack type
const getAttackRange = (attackType: 'melee' | 'ranged'): number => {
    return attackType === 'melee' ? 1.5 : 10; // Melee needs to be close, ranged can attack from far
};

// Get movement speed
const getMoveSpeed = (attackType: 'melee' | 'ranged'): number => {
    return attackType === 'melee' ? 0.4 : 0.2; // Melee moves faster to get in range
};

export interface CombatEntity {
    id: string;
    type: 'hero' | 'enemy';
    characterType: CharacterType | EnemyType;
    health: number;
    maxHealth: number;
    position: [number, number, number];
    isAlive: boolean;
}

export type BattleStatus = 'setup' | 'in-progress' | 'victory' | 'defeat';

interface BattleContextType {
    battleStatus: BattleStatus;
    heroes: CombatEntity[];
    enemies: CombatEntity[];
    startBattle: () => void;
    heroAction: (heroId: string, action: 'melee' | 'ranged', targetId?: string) => void;
    processEnemyTurns: () => void;
    resetBattle: () => void;
}

const BattleContext = createContext<BattleContextType | undefined>(undefined);

export function BattleProvider({ 
    children, 
    selectedTeam,
    enemyTypes = ['zombie'] as EnemyType[]
}: { 
    children: ReactNode;
    selectedTeam: CharacterType[];
    enemyTypes?: EnemyType[];
}) {
    const [battleStatus, setBattleStatus] = useState<BattleStatus>('setup');
    const [heroes, setHeroes] = useState<CombatEntity[]>([]);
    const [enemies, setEnemies] = useState<CombatEntity[]>([]);

    const initializeBattle = () => {
        // Initialize heroes
        const heroEntities: CombatEntity[] = selectedTeam.map((type, index) => ({
            id: `hero-${index}`,
            type: 'hero',
            characterType: type,
            health: 100,
            maxHealth: 100,
            position: [-6, index * -2.5, 0],
            isAlive: true,
        }));

        // Initialize enemies (1 zombie for now)
        const enemyEntities: CombatEntity[] = enemyTypes.map((type, index) => ({
            id: `enemy-${index}`,
            type: 'enemy',
            characterType: type,
            health: 50,
            maxHealth: 50,
            position: [4, index * -2.5, 0],
            isAlive: true,
        }));

        setHeroes(heroEntities);
        setEnemies(enemyEntities);
    };

    const combatIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const startBattle = () => {
        initializeBattle();
        setBattleStatus('in-progress');
    };

    // Automated combat loop
    useEffect(() => {
        if (battleStatus !== 'in-progress') {
            if (combatIntervalRef.current) {
                clearInterval(combatIntervalRef.current);
                combatIntervalRef.current = null;
            }
            return;
        }

        // Process hero turns
        const processHeroTurns = () => {
            setHeroes(prevHeroes => {
                setEnemies(prevEnemies => {
                    const aliveHeroes = prevHeroes.filter(h => h.isAlive);
                    const aliveEnemies = prevEnemies.filter(e => e.isAlive);

                    // Check win/lose conditions first
                    if (aliveEnemies.length === 0) {
                        setBattleStatus('victory');
                        return prevEnemies;
                    }
                    if (aliveHeroes.length === 0) {
                        setBattleStatus('defeat');
                        return prevEnemies;
                    }

                    // Process each alive hero's turn - move and attack
                    let updatedEnemies = [...prevEnemies];
                    let updatedHeroes = [...prevHeroes];
                    
                    aliveHeroes.forEach(hero => {
                        const heroIndex = updatedHeroes.findIndex(h => h.id === hero.id);
                        if (heroIndex < 0) return;

                        // Find closest alive enemy
                        const closestEnemy = aliveEnemies.reduce((closest, enemy) => {
                            const heroPos = hero.position;
                            const closestDist = Math.abs(closest.position[0] - heroPos[0]);
                            const enemyDist = Math.abs(enemy.position[0] - heroPos[0]);
                            return enemyDist < closestDist ? enemy : closest;
                        });

                        if (!closestEnemy) return;

                        // Get attack type and range
                        const attackType = getCharacterAttackType(hero.characterType as CharacterType);
                        const attackRange = getAttackRange(attackType);
                        const moveSpeed = getMoveSpeed(attackType);
                        
                        const currentX = hero.position[0];
                        const targetX = closestEnemy.position[0];
                        const distance = Math.abs(currentX - targetX);

                        // Move toward enemy if not in range
                        if (distance > attackRange) {
                            const newX = currentX > targetX 
                                ? Math.max(targetX + attackRange, currentX - moveSpeed)
                                : Math.min(targetX - attackRange, currentX + moveSpeed);
                            
                            updatedHeroes[heroIndex] = {
                                ...updatedHeroes[heroIndex],
                                position: [newX, hero.position[1], hero.position[2]],
                            };
                        } else {
                            // In range - attack!
                            const damage = attackType === 'melee' ? 15 : 12;
                            const enemyIndex = updatedEnemies.findIndex(e => e.id === closestEnemy.id);
                            if (enemyIndex >= 0) {
                                const newHealth = Math.max(0, updatedEnemies[enemyIndex].health - damage);
                                updatedEnemies[enemyIndex] = {
                                    ...updatedEnemies[enemyIndex],
                                    health: newHealth,
                                    isAlive: newHealth > 0,
                                };
                            }
                        }
                    });
                    
                    return updatedEnemies;
                });
                // Update heroes with new positions
                return updatedHeroes;
            });
        };

        // Process enemy turns
        const processEnemyTurnsAuto = () => {
            setEnemies(prevEnemies => {
                const updatedEnemies = [...prevEnemies];
                
                setHeroes(prevHeroes => {
                    const aliveHeroes = prevHeroes.filter(h => h.isAlive);
                    const aliveEnemies = updatedEnemies.filter(e => e.isAlive);

                    // Check win/lose conditions
                    if (aliveEnemies.length === 0) {
                        setBattleStatus('victory');
                        return prevHeroes;
                    }
                    if (aliveHeroes.length === 0) {
                        setBattleStatus('defeat');
                        return prevHeroes;
                    }

                    const updatedHeroes = [...prevHeroes];

                    aliveEnemies.forEach(enemy => {
                        const enemyIndex = updatedEnemies.findIndex(e => e.id === enemy.id);
                        if (enemyIndex < 0) return;

                        // Find closest alive hero
                        const closestHero = aliveHeroes.reduce((closest, hero) => {
                            const enemyPos = enemy.position;
                            const closestDist = Math.abs(closest.position[0] - enemyPos[0]);
                            const heroDist = Math.abs(hero.position[0] - enemyPos[0]);
                            return heroDist < closestDist ? hero : closest;
                        });

                        const currentX = enemy.position[0];
                        const targetX = closestHero.position[0];
                        const distance = Math.abs(currentX - targetX);
                        const meleeRange = 1.5; // Enemies use melee
                        const moveSpeed = 0.3;

                        // Move toward hero if not in range
                        if (distance > meleeRange) {
                            const newX = currentX > targetX 
                                ? Math.max(targetX + meleeRange, currentX - moveSpeed)
                                : Math.min(targetX - meleeRange, currentX + moveSpeed);
                            
                            updatedEnemies[enemyIndex] = {
                                ...updatedEnemies[enemyIndex],
                                position: [newX, enemy.position[1], enemy.position[2]],
                            };
                        } else {
                            // In range - attack!
                            const damage = 10;
                            const heroIndex = updatedHeroes.findIndex(h => h.id === closestHero.id);
                            if (heroIndex >= 0) {
                                const newHealth = Math.max(0, updatedHeroes[heroIndex].health - damage);
                                updatedHeroes[heroIndex] = {
                                    ...updatedHeroes[heroIndex],
                                    health: newHealth,
                                    isAlive: newHealth > 0,
                                };
                            }
                        }
                    });

                    return updatedHeroes;
                });
                
                return updatedEnemies;
            });
        };

        // Combined combat turn
        const processCombatTurn = () => {
            processHeroTurns();
            setTimeout(() => {
                processEnemyTurnsAuto();
            }, 500);
        };

        // Run combat turn every 0.8 seconds for smoother movement
        combatIntervalRef.current = setInterval(processCombatTurn, 800);
        // Process first turn immediately
        processCombatTurn();

        return () => {
            if (combatIntervalRef.current) {
                clearInterval(combatIntervalRef.current);
                combatIntervalRef.current = null;
            }
        };
    }, [battleStatus]);

    const heroAction = (heroId: string, action: 'melee' | 'ranged', targetId?: string) => {
        if (battleStatus !== 'in-progress') return;

        setHeroes(prev => prev.map(hero => {
            if (hero.id !== heroId || !hero.isAlive) return hero;
            
            // Find closest enemy if no target specified
            let target: CombatEntity | undefined;
            if (targetId) {
                target = enemies.find(e => e.id === targetId && e.isAlive);
            } else {
                // Find closest alive enemy
                const aliveEnemies = enemies.filter(e => e.isAlive);
                if (aliveEnemies.length > 0) {
                    target = aliveEnemies.reduce((closest, enemy) => {
                        const heroPos = hero.position;
                        const closestDist = Math.abs(closest.position[0] - heroPos[0]);
                        const enemyDist = Math.abs(enemy.position[0] - heroPos[0]);
                        return enemyDist < closestDist ? enemy : closest;
                    });
                }
            }

            if (!target) return hero;

            // Calculate damage (simple for now)
            const damage = action === 'melee' ? 15 : 10;
            
            // Apply damage to target
            setEnemies(prevEnemies => prevEnemies.map(enemy => {
                if (enemy.id === target!.id) {
                    const newHealth = Math.max(0, enemy.health - damage);
                    return {
                        ...enemy,
                        health: newHealth,
                        isAlive: newHealth > 0,
                    };
                }
                return enemy;
            }));

            return hero;
        }));

        // Process enemy turns after hero action
        setTimeout(() => processEnemyTurns(), 500);
    };

    const processEnemyTurns = () => {
        setEnemies(prev => {
            const currentHeroes = heroes; // Capture current heroes state
            return prev.map(enemy => {
                if (!enemy.isAlive) return enemy;

                // Find closest alive hero
                const aliveHeroes = currentHeroes.filter(h => h.isAlive);
                if (aliveHeroes.length === 0) return enemy;

            const closestHero = aliveHeroes.reduce((closest, hero) => {
                const enemyPos = enemy.position;
                const closestDist = Math.abs(closest.position[0] - enemyPos[0]);
                const heroDist = Math.abs(hero.position[0] - enemyPos[0]);
                return heroDist < closestDist ? hero : closest;
            });

            // Move toward hero (simple: reduce distance)
            const currentX = enemy.position[0];
            const targetX = closestHero.position[0];
            const moveSpeed = 0.3;
            const newX = currentX > targetX 
                ? Math.max(targetX, currentX - moveSpeed)
                : Math.min(targetX, currentX + moveSpeed);

            // Attack if close enough (within 1 unit)
            if (Math.abs(newX - targetX) < 1) {
                const damage = 10;
                setHeroes(prevHeroes => prevHeroes.map(hero => {
                    if (hero.id === closestHero.id) {
                        const newHealth = Math.max(0, hero.health - damage);
                        return {
                            ...hero,
                            health: newHealth,
                            isAlive: newHealth > 0,
                        };
                    }
                    return hero;
                }));
            }

                return {
                    ...enemy,
                    position: [newX, enemy.position[1], enemy.position[2]],
                };
            });
        });

        // Check win/lose conditions
        setTimeout(() => {
            setHeroes(prevHeroes => {
                setEnemies(prevEnemies => {
                    const aliveHeroes = prevHeroes.filter(h => h.isAlive);
                    const aliveEnemies = prevEnemies.filter(e => e.isAlive);

                    if (aliveEnemies.length === 0) {
                        setBattleStatus('victory');
                    } else if (aliveHeroes.length === 0) {
                        setBattleStatus('defeat');
                    }
                    return prevEnemies;
                });
                return prevHeroes;
            });
        }, 100);
    };

    const resetBattle = () => {
        if (combatIntervalRef.current) {
            clearInterval(combatIntervalRef.current);
            combatIntervalRef.current = null;
        }
        setBattleStatus('setup');
        setHeroes([]);
        setEnemies([]);
    };

    return (
        <BattleContext.Provider
            value={{
                battleStatus,
                heroes,
                enemies,
                startBattle,
                heroAction,
                processEnemyTurns,
                resetBattle,
            }}
        >
            {children}
        </BattleContext.Provider>
    );
}

export function useBattle() {
    const context = useContext(BattleContext);
    if (!context) {
        throw new Error('useBattle must be used within BattleProvider');
    }
    return context;
}


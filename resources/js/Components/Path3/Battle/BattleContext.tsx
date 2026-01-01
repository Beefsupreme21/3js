import { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { CharacterType, EnemyType } from '../Types/Character';

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

export interface ProjectileData {
    id: string;
    from: [number, number, number];
    to: [number, number, number];
    type: 'arrow' | 'wand' | 'spell' | 'melee';
}

export interface DamageNumberData {
    id: string;
    position: [number, number, number];
    damage: number;
}

export type BattleStatus = 'setup' | 'in-progress' | 'victory' | 'defeat';

interface BattleContextType {
    battleStatus: BattleStatus;
    heroes: CombatEntity[];
    enemies: CombatEntity[];
    projectiles: ProjectileData[];
    damageNumbers: DamageNumberData[];
    startBattle: () => void;
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
    const [projectiles, setProjectiles] = useState<ProjectileData[]>([]);
    const [damageNumbers, setDamageNumbers] = useState<DamageNumberData[]>([]);
    const projectileIdCounter = useRef(0);
    const damageNumberIdCounter = useRef(0);

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

        // Initialize enemies
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
                const updatedHeroes = [...prevHeroes];
                
                setEnemies(prevEnemies => {
                    const aliveHeroes = updatedHeroes.filter(h => h.isAlive);
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

                    const updatedEnemies = [...prevEnemies];
                    
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
                            const damage = 1; // Reduced damage
                            const enemyIndex = updatedEnemies.findIndex(e => e.id === closestEnemy.id);
                            if (enemyIndex >= 0) {
                                // Spawn projectile for ranged attacks
                                if (attackType === 'ranged') {
                                    const projectileType = hero.characterType === 'hunter' ? 'arrow' :
                                                        hero.characterType === 'mage' ? 'wand' :
                                                        hero.characterType === 'warlock' ? 'spell' :
                                                        hero.characterType === 'priest' ? 'spell' : 'wand';
                                    
                                    const projectileId = `proj-${projectileIdCounter.current++}`;
                                    setProjectiles(prev => [...prev, {
                                        id: projectileId,
                                        from: hero.position,
                                        to: closestEnemy.position,
                                        type: projectileType,
                                    }]);
                                    
                                    // Remove projectile after animation (longer for visibility)
                                    setTimeout(() => {
                                        setProjectiles(prev => prev.filter(p => p.id !== projectileId));
                                    }, 800);
                                    
                                    // Apply damage after projectile hits
                                    setTimeout(() => {
                                        setEnemies(prev => prev.map(e => {
                                            if (e.id === closestEnemy.id) {
                                                const newHealth = Math.max(0, e.health - damage);
                                                
                                                // Spawn damage number
                                                const damageNumberId = `dmg-${damageNumberIdCounter.current++}`;
                                                setDamageNumbers(prev => [...prev, {
                                                    id: damageNumberId,
                                                    position: e.position,
                                                    damage: damage,
                                                }]);
                                                
                                                // Remove damage number after animation
                                                setTimeout(() => {
                                                    setDamageNumbers(prev => prev.filter(d => d.id !== damageNumberId));
                                                }, 1000);
                                                
                                                return {
                                                    ...e,
                                                    health: newHealth,
                                                    isAlive: newHealth > 0,
                                                };
                                            }
                                            return e;
                                        }));
                                    }, 400);
                                } else {
                                    // Melee attack - apply damage immediately with visual
                                    const projectileId = `proj-${projectileIdCounter.current++}`;
                                    setProjectiles(prev => [...prev, {
                                        id: projectileId,
                                        from: hero.position,
                                        to: closestEnemy.position,
                                        type: 'melee',
                                    }]);
                                    
                                    setTimeout(() => {
                                        setProjectiles(prev => prev.filter(p => p.id !== projectileId));
                                    }, 300);
                                    
                                    // Apply melee damage
                                    const newHealth = Math.max(0, updatedEnemies[enemyIndex].health - damage);
                                    
                                    // Spawn damage number
                                    const damageNumberId = `dmg-${damageNumberIdCounter.current++}`;
                                    setDamageNumbers(prev => [...prev, {
                                        id: damageNumberId,
                                        position: closestEnemy.position,
                                        damage: damage,
                                    }]);
                                    
                                    // Remove damage number after animation
                                    setTimeout(() => {
                                        setDamageNumbers(prev => prev.filter(d => d.id !== damageNumberId));
                                    }, 1000);
                                    
                                    updatedEnemies[enemyIndex] = {
                                        ...updatedEnemies[enemyIndex],
                                        health: newHealth,
                                        isAlive: newHealth > 0,
                                    };
                                }
                            }
                        }
                    });

                    return updatedEnemies;
                });
                
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
                            const damage = 1; // Reduced damage
                            const heroIndex = updatedHeroes.findIndex(h => h.id === closestHero.id);
                            if (heroIndex >= 0) {
                                // Spawn melee attack visual
                                const projectileId = `proj-${projectileIdCounter.current++}`;
                                setProjectiles(prev => [...prev, {
                                    id: projectileId,
                                    from: enemy.position,
                                    to: closestHero.position,
                                    type: 'melee',
                                }]);
                                
                                setTimeout(() => {
                                    setProjectiles(prev => prev.filter(p => p.id !== projectileId));
                                }, 300);
                                
                                // Apply melee damage immediately
                                const newHealth = Math.max(0, updatedHeroes[heroIndex].health - damage);
                                
                                // Spawn damage number
                                const damageNumberId = `dmg-${damageNumberIdCounter.current++}`;
                                setDamageNumbers(prev => [...prev, {
                                    id: damageNumberId,
                                    position: closestHero.position,
                                    damage: damage,
                                }]);
                                
                                // Remove damage number after animation
                                setTimeout(() => {
                                    setDamageNumbers(prev => prev.filter(d => d.id !== damageNumberId));
                                }, 1000);
                                
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

    const resetBattle = () => {
        if (combatIntervalRef.current) {
            clearInterval(combatIntervalRef.current);
            combatIntervalRef.current = null;
        }
        setBattleStatus('setup');
        setHeroes([]);
        setEnemies([]);
        setProjectiles([]);
        setDamageNumbers([]);
        projectileIdCounter.current = 0;
        damageNumberIdCounter.current = 0;
    };

    return (
        <BattleContext.Provider
            value={{
                battleStatus,
                heroes,
                enemies,
                projectiles,
                damageNumbers,
                startBattle,
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


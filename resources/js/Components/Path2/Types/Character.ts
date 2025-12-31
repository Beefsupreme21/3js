/**
 * Base character type - shared by heroes and enemies
 */
export type CharacterType = 'warrior' | 'hunter' | 'mage' | 'warlock' | 'priest';

export type EnemyType = 'zombie' | 'goblin' | 'orc' | 'skeleton' | 'dragon';

/**
 * Base character stats interface
 */
export interface CharacterStats {
    health: number;
    maxHealth: number;
    attack: number;
    defense: number;
    speed: number;
}

/**
 * Character metadata
 */
export interface CharacterMetadata {
    id: CharacterType | EnemyType;
    name: string;
    description?: string;
    stats: CharacterStats;
}


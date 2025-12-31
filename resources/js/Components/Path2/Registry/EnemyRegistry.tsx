import { ComponentType } from 'react';
import { EnemyType } from '../Types/Character';
import { Zombie } from '../Enemies';

/**
 * Registry mapping enemy types to their React components
 * Add new enemies here as you create them
 */
export const EnemyRegistry: Partial<Record<EnemyType, ComponentType<any>>> = {
    zombie: Zombie,
    // goblin: require('../Enemies/Goblin').default,
    // orc: require('../Enemies/Orc').default,
    // skeleton: require('../Enemies/Skeleton').default,
    // dragon: require('../Enemies/Dragon').default,
};

/**
 * Get an enemy component by type
 */
export function getEnemyComponent(type: EnemyType): ComponentType<any> {
    const Component = EnemyRegistry[type];
    if (!Component) {
        throw new Error(`Enemy type "${type}" not found in registry`);
    }
    return Component;
}

/**
 * Get all available enemy types
 */
export function getAllEnemyTypes(): EnemyType[] {
    return Object.keys(EnemyRegistry) as EnemyType[];
}


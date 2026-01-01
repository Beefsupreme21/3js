import { ComponentType } from 'react';
import { EnemyType } from '../Types/Character';
import { Zombie } from '../Enemies';

export const EnemyRegistry: Partial<Record<EnemyType, ComponentType<any>>> = {
    zombie: Zombie,
};

export function getEnemyComponent(type: EnemyType): ComponentType<any> {
    const Component = EnemyRegistry[type];
    if (!Component) {
        throw new Error(`Enemy type "${type}" not found in registry`);
    }
    return Component;
}

export function getAllEnemyTypes(): EnemyType[] {
    return Object.keys(EnemyRegistry) as EnemyType[];
}


import { ComponentType } from 'react';
import { CharacterType } from '../Types/Character';
import { Warrior, Hunter, Mage, Warlock, Priest } from '../Characters';

export const CharacterRegistry: Record<CharacterType, ComponentType<any>> = {
    warrior: Warrior,
    hunter: Hunter,
    mage: Mage,
    warlock: Warlock,
    priest: Priest,
};

export function getCharacterComponent(type: CharacterType): ComponentType<any> {
    const Component = CharacterRegistry[type];
    if (!Component) {
        throw new Error(`Character type "${type}" not found in registry`);
    }
    return Component;
}

export function getAllCharacterTypes(): CharacterType[] {
    return Object.keys(CharacterRegistry) as CharacterType[];
}


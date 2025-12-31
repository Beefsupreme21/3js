import { ComponentType } from 'react';
import { CharacterType } from '../Types/Character';
// Import all character components
import { Warrior, Hunter, Mage, Warlock, Priest } from '../Characters';

/**
 * Registry mapping character types to their React components
 * 
 * To add a new character:
 * 1. Create the component in Characters/ folder
 * 2. Import it above
 * 3. Add it to this registry
 */
export const CharacterRegistry: Record<CharacterType, ComponentType<any>> = {
    warrior: Warrior,
    hunter: Hunter,
    mage: Mage,
    warlock: Warlock,
    priest: Priest,
};

/**
 * Get a character component by type
 */
export function getCharacterComponent(type: CharacterType): ComponentType<any> {
    const Component = CharacterRegistry[type];
    if (!Component) {
        throw new Error(`Character type "${type}" not found in registry`);
    }
    return Component;
}

/**
 * Get all available character types
 */
export function getAllCharacterTypes(): CharacterType[] {
    return Object.keys(CharacterRegistry) as CharacterType[];
}


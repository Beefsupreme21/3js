# Refactoring Plan - Path2 Game Architecture

## Current State
- All character components are in the root `Path2/` folder
- Hardcoded character mapping in `GameMap.tsx`
- No shared types or interfaces
- No enemy system yet

## Proposed Structure

```
Path2/
├── Characters/              # Hero/player characters
│   ├── Warrior.tsx         # Move from root
│   ├── Hunter.tsx          # Move from root
│   ├── Mage.tsx            # Move from root
│   ├── Warlock.tsx         # Move from root
│   ├── Priest.tsx          # Move from root
│   └── index.ts            # Export all + convenience exports
│
├── Enemies/                # Enemy characters (NEW)
│   ├── Goblin.tsx          # First enemy to create
│   └── index.ts            # Export all
│
├── Locations/              # Different location/node types (NEW)
│   ├── Fight.tsx           # Fight encounter screen
│   ├── Town.tsx            # Town visit screen
│   └── index.ts
│
├── Types/                  # Shared type definitions (NEW)
│   └── Character.ts        # Base interfaces
│
├── Registry/               # Central registries (NEW)
│   ├── CharacterRegistry.tsx
│   └── EnemyRegistry.tsx
│
├── GameMap.tsx             # Main map view (update to use registry)
├── Scene.tsx               # Scene router
├── Path2Context.tsx        # Game state
└── ... (other UI components)
```

## Benefits

### 1. **Scalability**
- Add new hero? Create component in `Characters/`, add to registry
- Add new enemy? Create component in `Enemies/`, add to registry
- Add new location? Create component in `Locations/`

### 2. **Type Safety**
- Shared `CharacterType` and `EnemyType` enums
- `CharacterStats` interface for consistent stats
- TypeScript catches missing registrations

### 3. **Maintainability**
- Clear separation: Characters vs Enemies vs Locations
- Single source of truth (registries)
- Easy to find and modify components

### 4. **Developer Experience**
```typescript
// Instead of:
import Warrior from './Warrior';
import Hunter from './Hunter';
// ... etc

// You do:
import { getCharacterComponent } from './Registry/CharacterRegistry';
const Character = getCharacterComponent('warrior');
```

## Migration Steps

1. ✅ Create `Types/Character.ts` with base types
2. ✅ Create `Registry/CharacterRegistry.tsx` 
3. ✅ Create `Registry/EnemyRegistry.tsx` (empty for now)
4. ⏳ Move character components to `Characters/` folder
5. ⏳ Update imports in `GameMap.tsx` to use registry
6. ⏳ Create first enemy in `Enemies/Goblin.tsx`
7. ⏳ Create `Locations/Fight.tsx` for fight encounters

## Example: Adding a New Hero

```typescript
// 1. Create Characters/Rogue.tsx
export default function Rogue({ position }: CharacterProps) {
    // ... component code
}

// 2. Add to Types/Character.ts
export type CharacterType = 'warrior' | 'hunter' | ... | 'rogue';

// 3. Add to Registry/CharacterRegistry.tsx
import Rogue from '../Characters/Rogue';
export const CharacterRegistry = {
    // ... existing
    rogue: Rogue,
};
```

Done! The new hero is now available everywhere.


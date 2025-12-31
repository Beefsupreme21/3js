# Path2 Game Architecture

## Proposed Folder Structure

```
Path2/
├── Characters/          # All hero/player characters
│   ├── Warrior.tsx
│   ├── Hunter.tsx
│   ├── Mage.tsx
│   ├── Warlock.tsx
│   ├── Priest.tsx
│   └── index.ts        # Export all + registry
├── Enemies/            # All enemy characters
│   ├── Goblin.tsx
│   ├── Orc.tsx
│   └── index.ts        # Export all + registry
├── Locations/          # Different location/node types
│   ├── Fight.tsx       # Fight encounter screen
│   ├── Town.tsx        # Town visit screen
│   └── index.ts
├── Types/              # Shared type definitions
│   └── Character.ts    # Base character interface
├── Registry/           # Central registries
│   ├── CharacterRegistry.ts
│   └── EnemyRegistry.ts
├── GameMap.tsx         # Main map view
├── Scene.tsx           # Scene router
├── Path2Context.tsx    # Game state
└── ...
```

## Key Design Principles

1. **Type-Driven**: Shared interfaces for all characters
2. **Registry Pattern**: Easy lookup and extension
3. **Component Composition**: Reusable base components
4. **Data-Driven**: Character stats/config in one place

## Benefits

- **Scalable**: Add new heroes/enemies by creating component + registering
- **Type-Safe**: TypeScript ensures consistency
- **Maintainable**: Clear separation of concerns
- **Testable**: Each component is isolated


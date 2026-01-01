import { useState } from 'react';
import { useBattle } from '../Path2/Battle/BattleContext';
import { CharacterType } from '../Path2/Path2Context';

// Get default attack type for each character (same as in BattleContext)
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

export default function BattleOverlay() {
    const { battleStatus, startBattle, heroes, resetBattle } = useBattle();

    const handleVictory = () => {
        resetBattle();
        // Return to setup - this will be handled by parent
        window.location.reload();
    };

    if (battleStatus === 'setup') {
        return (
            <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
                <div className="pointer-events-auto">
                    <button
                        onClick={startBattle}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-lg transition-colors shadow-lg"
                    >
                        Start Fight
                    </button>
                </div>
            </div>
        );
    }

    if (battleStatus === 'victory') {
        return (
            <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
                <div className="pointer-events-auto text-center">
                    <h2 className="text-4xl font-bold text-green-400 mb-4">Victory!</h2>
                    <button
                        onClick={handleVictory}
                        className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-lg transition-colors shadow-lg"
                    >
                        New Battle
                    </button>
                </div>
            </div>
        );
    }

    if (battleStatus === 'defeat') {
        return (
            <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
                <div className="pointer-events-auto text-center">
                    <h2 className="text-4xl font-bold text-red-400 mb-4">Defeat!</h2>
                    <button
                        onClick={handleVictory}
                        className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-lg transition-colors shadow-lg"
                    >
                        New Battle
                    </button>
                </div>
            </div>
        );
    }

    // In-progress: Show battle status (automated combat)
    return (
        <div className="absolute bottom-0 left-0 right-0 z-40 bg-black/80 p-4 pointer-events-none">
            <div className="pointer-events-auto max-w-4xl mx-auto">
                <div className="grid grid-cols-4 gap-4">
                    {heroes.map((hero) => (
                        <div key={hero.id} className="bg-white/10 rounded p-2">
                            <div className="text-white text-sm font-semibold mb-2">
                                {hero.characterType.charAt(0).toUpperCase() + hero.characterType.slice(1)}
                            </div>
                            <div className="text-white/80 text-xs mb-2">
                                HP: {hero.health}/{hero.maxHealth}
                            </div>
                            <div className="text-white/60 text-xs">
                                {hero.isAlive ? (
                                    getCharacterAttackType(hero.characterType as CharacterType) === 'melee' 
                                        ? '⚔️ Melee' 
                                        : '🏹 Ranged'
                                ) : (
                                    <span className="text-red-400">KO</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


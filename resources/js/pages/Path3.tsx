import { Head } from '@inertiajs/react';
import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import { BattleProvider } from '@/Components/Path3/Battle/BattleContext';
import BattleOverlay from '@/Components/Path3/Battle/BattleOverlay';
import FightScene from '@/Components/Path3/FightScene';
import { CharacterType } from '@/Components/Path3/Types/Character';
import { EnemyType } from '@/Components/Path3/Types/Character';

function BattleContent() {
    // Battle will start when user clicks "Start Fight" button in overlay

    return (
        <div className="h-screen w-screen bg-[#0a0a0f] relative">
            <Canvas
                orthographic
                camera={{
                    position: [0, 0, 10],
                    zoom: 30,
                    near: 0.1,
                    far: 100,
                }}
                gl={{ 
                    antialias: false,
                    preserveDrawingBuffer: true
                }}
            >
                <color attach="background" args={['#1a1a2e']} />
                <FightScene />
            </Canvas>
            <BattleOverlay />
        </div>
    );
}

const ALL_HEROES: CharacterType[] = ['warrior', 'hunter', 'mage', 'warlock', 'priest'];
const ALL_ENEMIES: EnemyType[] = ['zombie'];

function BattleSetup() {
    const [selectedHeroes, setSelectedHeroes] = useState<CharacterType[]>([]);
    const [selectedEnemies, setSelectedEnemies] = useState<EnemyType[]>(['zombie']);
    const [battleStarted, setBattleStarted] = useState(false);

    const toggleHero = (hero: CharacterType) => {
        setSelectedHeroes(prev => 
            prev.includes(hero) 
                ? prev.filter(h => h !== hero)
                : [...prev, hero]
        );
    };

    const toggleEnemy = (enemy: EnemyType) => {
        setSelectedEnemies(prev => 
            prev.includes(enemy) 
                ? prev.filter(e => e !== enemy)
                : [...prev, enemy]
        );
    };

    const startBattle = () => {
        if (selectedHeroes.length > 0 && selectedEnemies.length > 0) {
            setBattleStarted(true);
        }
    };

    if (battleStarted) {
        return (
            <BattleProvider selectedTeam={selectedHeroes} enemyTypes={selectedEnemies}>
                <BattleContent />
            </BattleProvider>
        );
    }

    return (
        <div className="h-screen w-screen bg-[#0a0a0f] flex items-center justify-center">
            <div className="max-w-4xl w-full p-8">
                <h1 className="text-4xl font-bold text-white mb-8 text-center">Battle Test</h1>
                
                <div className="grid grid-cols-2 gap-8 mb-8">
                    {/* Heroes Selection */}
                    <div className="bg-white/10 rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-white mb-4">Heroes</h2>
                        <div className="space-y-2">
                            {ALL_HEROES.map(hero => (
                                <label key={hero} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedHeroes.includes(hero)}
                                        onChange={() => toggleHero(hero)}
                                        className="w-5 h-5"
                                    />
                                    <span className="text-white capitalize">{hero}</span>
                                </label>
                            ))}
                        </div>
                        <div className="mt-4 text-white/60 text-sm">
                            Selected: {selectedHeroes.length}
                        </div>
                    </div>

                    {/* Enemies Selection */}
                    <div className="bg-white/10 rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-white mb-4">Enemies</h2>
                        <div className="space-y-2">
                            {ALL_ENEMIES.map(enemy => (
                                <label key={enemy} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedEnemies.includes(enemy)}
                                        onChange={() => toggleEnemy(enemy)}
                                        className="w-5 h-5"
                                    />
                                    <span className="text-white capitalize">{enemy}</span>
                                </label>
                            ))}
                        </div>
                        <div className="mt-4 text-white/60 text-sm">
                            Selected: {selectedEnemies.length}
                        </div>
                    </div>
                </div>

                {/* Start Battle Button */}
                <div className="text-center">
                    <button
                        onClick={startBattle}
                        disabled={selectedHeroes.length === 0 || selectedEnemies.length === 0}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg text-lg transition-colors"
                    >
                        Start Battle
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Path3() {
    return (
        <>
            <Head title="Path3 - Battle Test" />
            <BattleSetup />
        </>
    );
}


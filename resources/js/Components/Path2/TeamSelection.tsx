import { usePath2 } from './Path2Context';

const CHARACTER_NAMES: Record<string, string> = {
    warrior: 'Warrior',
    hunter: 'Hunter',
    mage: 'Mage',
    warlock: 'Warlock',
    priest: 'Priest',
};

export default function TeamSelection() {
    const { selectedTeam, removeCharacter, startGame } = usePath2();

    return (
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-6 z-40">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-white text-xl mb-4 text-center">Your Team ({selectedTeam.length}/4)</h2>
                <div className="flex gap-4 justify-center mb-4">
                    {[0, 1, 2, 3].map((index) => (
                        <div
                            key={index}
                            className="w-20 h-20 border-2 border-white/30 rounded bg-white/10 flex items-center justify-center"
                        >
                            {selectedTeam[index] ? (
                                <div className="text-center">
                                    <div className="text-white text-xs font-semibold">
                                        {CHARACTER_NAMES[selectedTeam[index]]}
                                    </div>
                                    <button
                                        onClick={() => removeCharacter(index)}
                                        className="text-red-400 text-xs mt-1 hover:text-red-300"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div className="text-white/30 text-xs">Empty</div>
                            )}
                        </div>
                    ))}
                </div>
                {selectedTeam.length === 4 && (
                    <div className="text-center">
                        <button
                            onClick={startGame}
                            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-lg transition-colors"
                        >
                            Start Run
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}


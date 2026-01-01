import { usePath2 } from './Path2Context';

export default function FightOverlay() {
    const { setScreen } = usePath2();

    const handleVictory = () => {
        setScreen('map');
    };

    return (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto">
                <button
                    onClick={handleVictory}
                    className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-lg transition-colors shadow-lg"
                >
                    We Won!
                </button>
            </div>
        </div>
    );
}


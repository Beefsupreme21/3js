import { useGame } from './GameContext';

export default function GameOverlay() {
    const { gear, currentSpeed } = useGame();

    return (
        <div className="absolute right-6 top-6 z-10">
            <div className="rounded-lg bg-black/50 px-4 py-3 backdrop-blur-sm">
                {/* Gear - show as 2/5 */}
                <p className="font-mono text-xs uppercase tracking-widest text-white/50">Gear</p>
                <p className="font-mono text-2xl font-bold text-orange-400">{gear}/5</p>
                
                {/* Speed in MPH */}
                <p className="mt-2 font-mono text-xs uppercase tracking-widest text-white/50">Speed</p>
                <p className="font-mono text-2xl font-bold text-cyan-400">
                    {Math.round(currentSpeed.current * 5)} MPH
                </p>
            </div>
        </div>
    );
}

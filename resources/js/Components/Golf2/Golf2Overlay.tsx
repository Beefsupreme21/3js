import { useGolf2 } from './Golf2Context';

export default function Golf2Overlay() {
    const { isGameStarted, startGame, power, targetPower, isCharging, club, setClub } = useGolf2();

    return (
        <>
            {!isGameStarted && (
                <div className="absolute inset-0 z-30 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <div className="relative flex flex-col items-center">
                        <h1 className="mb-4 font-mono text-8xl font-black tracking-widest text-green-400">
                            GOLF 2
                        </h1>
                        <button
                            onClick={startGame}
                            className="px-12 py-5 font-mono text-2xl font-bold uppercase tracking-widest text-green-400 border-2 border-green-500/50 bg-green-500/10 rounded-lg hover:bg-green-500/20"
                        >
                            Start Game
                        </button>
                    </div>
                </div>
            )}

            {isGameStarted && (
                <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
                    <div className="flex flex-col items-center gap-3">
                        {/* Club Switcher */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setClub('wedge')}
                                className={`px-4 py-2 font-mono text-sm font-bold uppercase rounded border-2 transition-all ${
                                    club === 'wedge'
                                        ? 'bg-green-500/20 border-green-400 text-green-300'
                                        : 'bg-black/50 border-white/30 text-white/60 hover:border-white/50'
                                }`}
                            >
                                Wedge (1/Q)
                            </button>
                            <button
                                onClick={() => setClub('putter')}
                                className={`px-4 py-2 font-mono text-sm font-bold uppercase rounded border-2 transition-all ${
                                    club === 'putter'
                                        ? 'bg-green-500/20 border-green-400 text-green-300'
                                        : 'bg-black/50 border-white/30 text-white/60 hover:border-white/50'
                                }`}
                            >
                                Putter (2/W)
                            </button>
                        </div>
                        <div className="text-sm font-mono text-white/80">
                            {isCharging ? 'Charging...' : 'Hold SPACE to charge | Up/Down: Set target'}
                        </div>
                        <div className="relative h-8 w-64 border-2 border-white/30 bg-black/50">
                            {/* Power bar fill */}
                            <div
                                className="h-full bg-gradient-to-r from-green-500 to-green-300"
                                style={{ width: `${power}%` }}
                            />
                            {/* Target power marker */}
                            <div
                                className="absolute top-0 bottom-0 w-0.5 bg-yellow-400"
                                style={{ left: `${targetPower}%` }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-mono text-sm font-bold text-white">
                                    {Math.round(power)}% / {Math.round(targetPower)}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

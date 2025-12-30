import { useGame } from './GameContext';

export default function GameOverlay() {
    const { isGameStarted, isGameOver, score, level, gatesCollected, gatesNeeded, showLevelUp, gatePopup, volume, setVolume, startGame, restartGame } = useGame();

    return (
        <>
            {/* Start Screen */}
            {!isGameStarted && (
                <div className="absolute inset-0 z-30 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    
                    <div className="relative flex flex-col items-center">
                        <h1
                            className="mb-4 font-mono text-8xl font-black tracking-widest text-cyan-400"
                            style={{
                                textShadow: '0 0 30px #00ffff, 0 0 60px #00ffff, 0 0 90px #0088ff',
                            }}
                        >
                            NEON RACER
                        </h1>
                        
                        <p className="mb-12 font-mono text-xl text-white/60">
                            Jump, duck, and dodge your way through!
                        </p>
                        
                        <button
                            onClick={startGame}
                            className="group relative overflow-hidden rounded-lg border-2 border-cyan-500/50 bg-cyan-500/10 px-12 py-5 font-mono text-2xl font-bold uppercase tracking-widest text-cyan-400 transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 hover:scale-105"
                            style={{
                                boxShadow: '0 0 30px rgba(0, 255, 255, 0.3)',
                            }}
                        >
                            <span className="relative z-10">Start Game</span>
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                        </button>
                        
                        <div className="mt-12 flex gap-8 text-center font-mono text-sm text-white/40">
                            <div><kbd className="rounded bg-white/10 px-2 py-1">A/D</kbd> Move</div>
                            <div><kbd className="rounded bg-white/10 px-2 py-1">W/↑</kbd> Boost</div>
                            <div><kbd className="rounded bg-white/10 px-2 py-1">SPACE</kbd> Jump</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Volume Control - always visible, even on death screen */}
            <div className="absolute left-6 top-6 z-30">
                <div className="rounded-lg bg-black/50 px-4 py-3 backdrop-blur-sm">
                    <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-2">Volume</p>
                    <div className="flex items-center gap-3">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                            style={{
                                background: `linear-gradient(to right, #00ffff 0%, #00ffff ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`,
                            }}
                        />
                        <span className="font-mono text-sm text-cyan-400 w-10 text-right">
                            {Math.round(volume * 100)}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Gate Popup - shows when passing through gate */}
            {gatePopup && !isGameOver && (
                <div className="absolute inset-0 z-15 flex items-center justify-center pointer-events-none">
                    <div
                        className="font-mono text-6xl font-black tracking-widest text-green-400 animate-bounce"
                        style={{
                            textShadow: '0 0 20px #00ff00, 0 0 40px #00ff00, 0 0 60px #00ff00',
                        }}
                    >
                        {gatePopup}
                    </div>
                </div>
            )}

            {/* Score and level display - only when game started */}
            {isGameStarted && (
            <div className="absolute right-6 top-6 z-10">
                <div className="rounded-lg bg-black/50 px-4 py-3 backdrop-blur-sm">
                    {/* Level */}
                    <p className="font-mono text-xs uppercase tracking-widest text-white/50">Level</p>
                    <p className="font-mono text-xl font-bold text-yellow-400">{level}</p>
                    
                    {/* Score */}
                    <p className="mt-2 font-mono text-xs uppercase tracking-widest text-white/50">Score</p>
                    <p className="font-mono text-2xl font-bold text-cyan-400">{score}</p>
                    
                    {/* Gates progress */}
                    <div className="mt-3 border-t border-white/10 pt-3">
                        <p className="font-mono text-xs uppercase tracking-widest text-white/50">Gates</p>
                        <p className="font-mono text-lg font-bold text-green-400">
                            {gatesCollected} / {gatesNeeded}
                        </p>
                    </div>
                </div>
            </div>
            )}

            {/* Level Up Celebration */}
            {showLevelUp && (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <h1
                            className="font-mono text-6xl font-black tracking-widest text-yellow-400 animate-pulse"
                            style={{
                                textShadow: '0 0 20px #ffaa00, 0 0 40px #ffaa00, 0 0 60px #ff8800',
                            }}
                        >
                            LEVEL {level}!
                        </h1>
                        <p className="mt-2 font-mono text-xl text-white/80">Congratulations!</p>
                    </div>
                </div>
            )}

            {/* Game Over Screen */}
            {isGameOver && (
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                    {/* Game Over content */}
                    <div className="relative flex flex-col items-center">
                        {/* Dramatic "WRECKED" text */}
                        <h1
                            className="mb-2 font-mono text-7xl font-black tracking-widest text-red-500"
                            style={{
                                textShadow: '0 0 20px #ff0000, 0 0 40px #ff0000, 0 0 60px #ff3300',
                            }}
                        >
                            WRECKED
                        </h1>

                        {/* Subtitle */}
                        <p className="mb-8 font-mono text-lg tracking-wide text-white/60">
                            Your ship has been destroyed
                        </p>

                        {/* Final stats */}
                        <div className="mb-8 flex gap-8 text-center">
                            <div>
                                <p className="font-mono text-sm uppercase tracking-widest text-white/40">Final Score</p>
                                <p
                                    className="font-mono text-5xl font-bold text-cyan-400"
                                    style={{
                                        textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff',
                                    }}
                                >
                                    {score}
                                </p>
                            </div>
                            <div>
                                <p className="font-mono text-sm uppercase tracking-widest text-white/40">Level Reached</p>
                                <p
                                    className="font-mono text-5xl font-bold text-yellow-400"
                                    style={{
                                        textShadow: '0 0 10px #ffaa00, 0 0 20px #ffaa00',
                                    }}
                                >
                                    {level}
                                </p>
                            </div>
                        </div>

                        {/* Restart button */}
                        <button
                            onClick={restartGame}
                            className="group relative overflow-hidden rounded-lg border-2 border-cyan-500/50 bg-cyan-500/10 px-8 py-4 font-mono text-lg font-bold uppercase tracking-widest text-cyan-400 transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300"
                            style={{
                                boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)',
                            }}
                        >
                            <span className="relative z-10">Try Again</span>
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                        </button>

                        {/* Hint */}
                        <p className="mt-6 font-mono text-xs text-white/30">Press the button or refresh to restart</p>
                    </div>
                </div>
            )}
        </>
    );
}


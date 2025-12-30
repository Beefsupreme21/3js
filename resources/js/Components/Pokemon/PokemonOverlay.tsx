import { usePokemon } from './PokemonContext';

export default function PokemonOverlay() {
    const { isGameStarted, startGame } = usePokemon();

    return (
        <>
            {/* Start Screen */}
            {!isGameStarted && (
                <div className="absolute inset-0 z-30 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    
                    <div className="relative flex flex-col items-center">
                        <h1
                            className="mb-4 font-mono text-8xl font-black tracking-widest text-yellow-400"
                            style={{
                                textShadow: '0 0 30px #ffaa00, 0 0 60px #ffaa00, 0 0 90px #ff8800',
                            }}
                        >
                            POKEMON
                        </h1>
                        
                        <p className="mb-12 font-mono text-xl text-white/60">
                            Explore the world!
                        </p>
                        
                        <button
                            onClick={startGame}
                            className="group relative overflow-hidden rounded-lg border-2 border-yellow-500/50 bg-yellow-500/10 px-12 py-5 font-mono text-2xl font-bold uppercase tracking-widest text-yellow-400 transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-500/20 hover:text-yellow-300 hover:scale-105"
                            style={{
                                boxShadow: '0 0 30px rgba(255, 170, 0, 0.3)',
                            }}
                        >
                            <span className="relative z-10">Start Game</span>
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                        </button>

                        <div className="mt-12 flex gap-8 text-center font-mono text-sm text-white/40">
                            <div><kbd className="rounded bg-white/10 px-2 py-1">WASD</kbd> Move</div>
                            <div><kbd className="rounded bg-white/10 px-2 py-1">Arrow Keys</kbd> Move</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}


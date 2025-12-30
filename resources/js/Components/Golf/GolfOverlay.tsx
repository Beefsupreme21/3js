import { useGolf } from './GolfContext';

export default function GolfOverlay() {
    const { isGameStarted, startGame } = useGolf();

    return (
        <>
            {/* Start Screen */}
            {!isGameStarted && (
                <div className="absolute inset-0 z-30 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    
                    <div className="relative flex flex-col items-center">
                        <h1
                            className="mb-4 font-mono text-8xl font-black tracking-widest text-green-400"
                            style={{
                                textShadow: '0 0 30px #00ff00, 0 0 60px #00ff00, 0 0 90px #008800',
                            }}
                        >
                            GOLF GAME
                        </h1>
                        
                        <p className="mb-12 font-mono text-xl text-white/60">
                            Swing away!
                        </p>
                        
                        <button
                            onClick={startGame}
                            className="group relative overflow-hidden rounded-lg border-2 border-green-500/50 bg-green-500/10 px-12 py-5 font-mono text-2xl font-bold uppercase tracking-widest text-green-400 transition-all duration-300 hover:border-green-400 hover:bg-green-500/20 hover:text-green-300 hover:scale-105"
                            style={{
                                boxShadow: '0 0 30px rgba(0, 255, 0, 0.3)',
                            }}
                        >
                            <span className="relative z-10">Start Game</span>
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-green-500/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}


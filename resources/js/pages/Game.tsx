import { Head } from '@inertiajs/react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import Scene from '@/Components/Race/Scene';
import GameOverlay from '@/Components/Race/GameOverlay';
import Music from '@/Components/Race/Music';
import { GameProvider } from '@/Components/Race/GameContext';

export default function Game() {
    return (
        <>
            <Head title="Racing Game" />
            <GameProvider>
                {/* Background music */}
                <Music />
                
                <div className="h-screen w-screen bg-[#0a0a0f]">
                    {/* Game UI Overlay (start screen, score, game over) */}
                    <GameOverlay />

                    {/* R3F Canvas - Full Screen */}
                    <Canvas
                        camera={{
                            position: [0, 6, 10],
                            fov: 60,
                            near: 0.1,
                            far: 200,
                        }}
                        gl={{ antialias: true }}
                        onCreated={({ camera }) => {
                            camera.lookAt(0, 0, -15);
                        }}
                    >
                        {/* Dark background */}
                        <color attach="background" args={['#050510']} />

                        {/* Background stars for atmosphere */}
                        <Stars radius={100} depth={50} count={3000} factor={4} fade speed={0.5} />

                        {/* Fog for depth */}
                        <fog attach="fog" args={['#050510', 30, 100]} />

                        {/* The 3D scene */}
                        <Scene />
                    </Canvas>

                </div>
            </GameProvider>
        </>
    );
}

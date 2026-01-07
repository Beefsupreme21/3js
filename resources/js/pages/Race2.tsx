import { Head } from '@inertiajs/react';
import { Canvas } from '@react-three/fiber';
import Scene from '@/Components/Race2/Scene';
import GameOverlay from '@/Components/Race2/GameOverlay';
import { GameProvider } from '@/Components/Race2/GameContext';

export default function Race2() {
    return (
        <>
            <Head title="Racing Game 2" />
            <GameProvider>
                <div className="h-screen w-screen bg-gray-900">
                    {/* Simple HUD overlay */}
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
                        {/* Light gray background */}
                        <color attach="background" args={['#1a1a1a']} />

                        {/* The 3D scene */}
                        <Scene />
                    </Canvas>
                </div>
            </GameProvider>
        </>
    );
}

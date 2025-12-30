import { Head } from '@inertiajs/react';
import { Canvas } from '@react-three/fiber';
import Scene from '@/Components/Pokemon/Scene';
import PokemonOverlay from '@/Components/Pokemon/PokemonOverlay';
import { PokemonProvider } from '@/Components/Pokemon/PokemonContext';

export default function Pokemon() {
    return (
        <>
            <Head title="Pokemon Game" />
            <PokemonProvider>
                <div className="h-screen w-screen bg-[#0a0a0f]">
                    {/* Game UI Overlay (start screen) */}
                    <PokemonOverlay />

                    {/* R3F Canvas - Full Screen */}
                    <Canvas
                        camera={{
                            position: [0, 3, 5],
                            fov: 60,
                            near: 0.1,
                            far: 200,
                        }}
                        gl={{ antialias: true }}
                    >
                        <color attach="background" args={['#87ceeb']} />
                        <Scene />
                    </Canvas>
                </div>
            </PokemonProvider>
        </>
    );
}


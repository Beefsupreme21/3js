import { Head } from '@inertiajs/react';
import { Canvas } from '@react-three/fiber';
import Scene from '@/Components/Boat/Scene';

export default function Boat() {
    return (
        <>
            <Head title="Boat Game" />
            <div className="h-screen w-screen bg-[#0a0a0f]">
                {/* R3F Canvas - Full Screen */}
                <Canvas
                    camera={{
                        position: [0, 8, 12],
                        fov: 60,
                        near: 0.1,
                        far: 200,
                    }}
                    gl={{ antialias: true }}
                    onCreated={({ camera }) => {
                        camera.lookAt(0, 0, 0);
                    }}
                >
                    <color attach="background" args={['#1a3a5a']} />
                    <fog attach="fog" args={['#1a3a5a', 20, 50]} />
                    <Scene />
                </Canvas>
                
                {/* Instructions overlay */}
                <div className="absolute top-4 left-4 text-white/80 text-sm">
                    <p className="font-semibold mb-2">Controls:</p>
                    <p>WASD or Arrow Keys to move</p>
                </div>
            </div>
        </>
    );
}


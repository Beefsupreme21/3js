import { Head } from '@inertiajs/react';
import { Canvas } from '@react-three/fiber';
import Scene from '@/Components/Path/Scene';

export default function Path() {
    return (
        <>
            <Head title="Path Game" />
            <div className="h-screen w-screen bg-[#0a0a0f]">
                {/* R3F Canvas - Full Screen */}
                <Canvas
                    orthographic
                    camera={{
                        position: [0, 0, 10],
                        zoom: 30,
                        near: 0.1,
                        far: 100,
                    }}
                    gl={{ 
                        antialias: false,
                        preserveDrawingBuffer: true
                    }}
                >
                    <color attach="background" args={['#2a2a3a']} />
                    <fog attach="fog" args={['#2a2a3a', 20, 50]} />
                    <Scene />
                </Canvas>
            </div>
        </>
    );
}


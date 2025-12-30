import { Head } from '@inertiajs/react';
import { Canvas } from '@react-three/fiber';
import Scene from '@/Components/Golf/Scene';

export default function Golf() {
    return (
        <>
            <Head title="Golf Game" />
            <div className="h-screen w-screen bg-[#0a0a0f]">
                <Canvas
                    camera={{
                        position: [0, 5, 10],
                        fov: 60,
                        near: 0.1,
                        far: 200,
                    }}
                    gl={{ antialias: true }}
                >
                    <color attach="background" args={['#1a3a2a']} />
                    <Scene />
                </Canvas>
            </div>
        </>
    );
}


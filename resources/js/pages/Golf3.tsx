import { Head } from '@inertiajs/react';
import { Canvas } from '@react-three/fiber';
import Scene from '@/Components/Golf3/Scene';
import Golf3Overlay from '@/Components/Golf3/Golf3Overlay';
import { Golf3Provider } from '@/Components/Golf3/Golf3Context';

export default function Golf3() {
    return (
        <>
            <Head title="Golf 3" />
            <Golf3Provider>
                <div className="h-screen w-screen bg-[#0a0a0f]">
                    <Golf3Overlay />
                    <Canvas
                        camera={{
                            position: [0, 2, 8],
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
            </Golf3Provider>
        </>
    );
}


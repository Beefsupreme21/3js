import { Head } from '@inertiajs/react';
import { Canvas } from '@react-three/fiber';
import Scene from '@/Components/Golf2/Scene';
import Golf2Overlay from '@/Components/Golf2/Golf2Overlay';
import { Golf2Provider } from '@/Components/Golf2/Golf2Context';

export default function Golf2() {
    return (
        <>
            <Head title="Golf 2" />
            <Golf2Provider>
                <div className="h-screen w-screen bg-[#0a0a0f]">
                    <Golf2Overlay />
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
            </Golf2Provider>
        </>
    );
}

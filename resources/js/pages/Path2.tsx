import { Head } from '@inertiajs/react';
import { Canvas } from '@react-three/fiber';
import Scene from '@/Components/Path2/Scene';
import { Path2Provider, usePath2 } from '@/Components/Path2/Path2Context';
import TitleScreen from '@/Components/Path2/TitleScreen';
import TeamSelection from '@/Components/Path2/TeamSelection';

function Path2Content() {
    const { isGameStarted } = usePath2();
    
    return (
        <div className="h-screen w-screen bg-[#0a0a0f] relative">
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
                <color attach="background" args={['#1a1a2e']} />
                <Scene />
            </Canvas>
            {!isGameStarted && <TitleScreen />}
            {!isGameStarted && <TeamSelection />}
        </div>
    );
}

export default function Path2() {
    return (
        <>
            <Head title="Path2 Game" />
            <Path2Provider>
                <Path2Content />
            </Path2Provider>
        </>
    );
}

import { Head } from '@inertiajs/react';
import { Canvas } from '@react-three/fiber';
import Scene from '@/Components/Path2/Scene';
import { Path2Provider, usePath2 } from '@/Components/Path2/Path2Context';
import TitleScreen from '@/Components/Path2/TitleScreen';
import TeamSelection from '@/Components/Path2/TeamSelection';
import { BattleProvider } from '@/Components/Path2/Battle/BattleContext';
import BattleOverlay from '@/Components/Path2/Battle/BattleOverlay';

function Path2Content() {
    const { isGameStarted, currentScreen, selectedTeam } = usePath2();
    
    const content = (
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
            {currentScreen === 'fight' && <BattleOverlay />}
        </div>
    );
    
    // Wrap in BattleProvider when in fight screen
    if (currentScreen === 'fight') {
        return (
            <BattleProvider selectedTeam={selectedTeam} enemyTypes={['zombie']}>
                {content}
            </BattleProvider>
        );
    }
    
    return content;
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

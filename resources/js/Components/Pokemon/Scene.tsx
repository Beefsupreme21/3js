import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import Character from './Character';
import Environment from './Environment';
import Pikachu from './Pikachu';
import { usePokemon } from './PokemonContext';

function Ground() {
    return (
        <>
            {/* Ground plane */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#90ee90" />
            </mesh>

            {/* Grid lines for reference */}
            <gridHelper args={[100, 100, '#888888', '#cccccc']} />
        </>
    );
}

function CameraController({ characterRef }: { characterRef: React.RefObject<Group> }) {
    const { camera } = useThree();
    const { isGameStarted } = usePokemon();

    useFrame(() => {
        if (!isGameStarted || !characterRef.current) return;

        const charPos = characterRef.current.position;
        const charRotation = characterRef.current.rotation.y;
        
        // Calculate camera position behind character
        // Behind = negative Z in character's local space
        const distance = 5;
        const height = 3;
        const cameraX = charPos.x - Math.sin(charRotation) * distance;
        const cameraZ = charPos.z - Math.cos(charRotation) * distance;
        const cameraY = charPos.y + height;
        
        // Smooth camera movement
        camera.position.lerp(new Vector3(cameraX, cameraY, cameraZ), 0.1);
        
        // Look at character
        camera.lookAt(charPos);
    });

    return null;
}

export default function Scene() {
    const characterGroupRef = useRef<Group>(null);

    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
            <directionalLight position={[-10, 5, -5]} intensity={0.4} color="#ffffff" />

            {/* Ground */}
            <Ground />

            {/* Environment - trees and grass */}
            <Environment />

            {/* Pokemon - spawn a few Pikachu */}
            <Pikachu position={[5, 0, 5]} />
            <Pikachu position={[-8, 0, 3]} />
            <Pikachu position={[3, 0, -7]} />
            <Pikachu position={[-5, 0, -6]} />

            {/* Character */}
            <Character ref={characterGroupRef} />

            {/* Camera controller */}
            <CameraController characterRef={characterGroupRef} />
        </>
    );
}

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import Character from './Character';
import Environment from './Environment';
import PokemonModel from './PokemonModel';
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

    // Generate random spawn positions for Pokemon (only once)
    // Spawn them in visible range around the player
    const pokemonSpawns = useMemo(() => {
        const spawns = [];
        
        // Spawn Pokemon in a circle around origin, within visible range (8-20 units)
        const positions = [
            [10, 0, 0],
            [-10, 0, 0],
            [0, 0, 10],
            [0, 0, -10],
            [7, 0, 7],
            [-7, 0, -7],
        ];
        
        for (let i = 0; i < 6; i++) {
            const [x, y, z] = positions[i];
            spawns.push({
                id: [25, 25, 1, 4, 7, 10][i],
                form: i === 1 ? 'shiny' : 'regular',
                pos: [x, y, z] as [number, number, number]
            });
        }
        
        return spawns;
    }, []);

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

            {/* Pokemon - Using Pokemon 3D API, randomly spawned */}
            {/* Test: Simple box at Pokemon position to verify positions */}
            <mesh position={[0, 1, 10]}>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial color="red" />
            </mesh>
            <PokemonModel
                url="https://raw.githubusercontent.com/Sudhanshu-Ambastha/Pokemon-3D-api/main/models/opt/regular/25.glb"
                position={[0, 0, 10]}
                scale={3}
            />
            {pokemonSpawns.map((pokemon, i) => (
                <PokemonModel
                    key={`${pokemon.id}-${pokemon.form}-${i}`}
                    url={`https://raw.githubusercontent.com/Sudhanshu-Ambastha/Pokemon-3D-api/main/models/opt/${pokemon.form}/${pokemon.id}.glb`}
                    position={pokemon.pos}
                    scale={3}
                />
            ))}

            {/* Character */}
            <Character ref={characterGroupRef} />

            {/* Camera controller */}
            <CameraController characterRef={characterGroupRef} />
        </>
    );
}

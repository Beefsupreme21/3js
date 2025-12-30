import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, RepeatWrapping, CanvasTexture } from 'three';
import { useGame } from './GameContext';

const BASE_SPEED = 12;
const TRACK_LENGTH = 100;
const TRACK_WIDTH = 20;

// Level-based themes and speed
const LEVEL_CONFIG = {
    1: {
        gridColor: '#ff00ff',
        borderColor: '#ff00ff',
        emissive: '#220033',
        speedMultiplier: 1.0,
    },
    2: {
        gridColor: '#00ffff',
        borderColor: '#00ccff',
        emissive: '#002233',
        speedMultiplier: 1.25,
    },
    3: {
        gridColor: '#00ff66',
        borderColor: '#00ff44',
        emissive: '#003322',
        speedMultiplier: 1.67,
    },
};

export default function Track() {
    const trackRef = useRef<Mesh>(null);
    const offsetRef = useRef(0);
    const { level, isBoosting } = useGame();

    // Get config for current level (default to level 1 if not defined)
    const config = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG] || LEVEL_CONFIG[1];
    const boostMultiplier = isBoosting ? 2.0 : 1.0;
    const trackSpeed = BASE_SPEED * config.speedMultiplier * boostMultiplier;

    // Create a grid pattern procedurally
    const gridTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d')!;

        // Dark background
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, 128, 128);

        // Neon grid lines - color based on level
        ctx.strokeStyle = config.gridColor;
        ctx.lineWidth = 1;

        // Horizontal lines
        for (let i = 0; i <= 8; i++) {
            ctx.globalAlpha = i === 4 ? 0.8 : 0.3;
            ctx.beginPath();
            ctx.moveTo(0, i * 16);
            ctx.lineTo(128, i * 16);
            ctx.stroke();
        }

        // Vertical lines
        for (let i = 0; i <= 8; i++) {
            ctx.globalAlpha = i === 4 ? 0.8 : 0.3;
            ctx.beginPath();
            ctx.moveTo(i * 16, 0);
            ctx.lineTo(i * 16, 128);
            ctx.stroke();
        }

        // Create texture from canvas
        const texture = new CanvasTexture(canvas);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(TRACK_WIDTH / 4, TRACK_LENGTH / 4);
        return texture;
    }, [config.gridColor]);

    // Animate the track scrolling
    useFrame((_, delta) => {
        if (gridTexture) {
            offsetRef.current += delta * trackSpeed * 0.25;
            gridTexture.offset.set(0, -offsetRef.current);
        }
    });

    return (
        <group>
            {/* Main track surface */}
            <mesh ref={trackRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -TRACK_LENGTH / 2 + 10]}>
                <planeGeometry args={[TRACK_WIDTH, TRACK_LENGTH]} />
                <meshStandardMaterial map={gridTexture} emissive={config.emissive} emissiveIntensity={0.1} />
            </mesh>

            {/* Left edge barrier - neon strip */}
            <mesh position={[-TRACK_WIDTH / 2 - 0.1, 0.3, -TRACK_LENGTH / 2 + 10]}>
                <boxGeometry args={[0.2, 0.6, TRACK_LENGTH]} />
                <meshStandardMaterial color={config.borderColor} emissive={config.borderColor} emissiveIntensity={1} />
            </mesh>

            {/* Right edge barrier - neon strip */}
            <mesh position={[TRACK_WIDTH / 2 + 0.1, 0.3, -TRACK_LENGTH / 2 + 10]}>
                <boxGeometry args={[0.2, 0.6, TRACK_LENGTH]} />
                <meshStandardMaterial color={config.borderColor} emissive={config.borderColor} emissiveIntensity={1} />
            </mesh>

            {/* Horizon fog effect */}
            <mesh position={[0, 5, -TRACK_LENGTH + 20]} rotation={[0, 0, 0]}>
                <planeGeometry args={[50, 20]} />
                <meshBasicMaterial color="#0a0a1a" transparent opacity={0.9} />
            </mesh>
        </group>
    );
}

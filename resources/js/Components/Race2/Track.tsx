import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, RepeatWrapping, CanvasTexture } from 'three';
import { useGame } from './GameContext';

const TRACK_LENGTH = 100;
const TRACK_WIDTH = 20;
const LANE_COUNT = 5;
const LANE_WIDTH = TRACK_WIDTH / LANE_COUNT;

export default function Track() {
    const trackRef = useRef<Mesh>(null);
    const offsetRef = useRef(0);
    const { currentSpeed } = useGame();

    // Use actual current speed
    const trackSpeed = currentSpeed.current;

    // Create a road texture with 5 lanes
    const roadTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d')!;

        // Dark road background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, 256, 256);

        // Lane dividers (white/yellow lines)
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 2;
        
        // Draw lane dividers (4 lines for 5 lanes)
        for (let i = 1; i < LANE_COUNT; i++) {
            const x = (i * 256) / LANE_COUNT;
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 256);
            ctx.stroke();
        }

        // Center line (dashed)
        ctx.strokeStyle = '#ffff00';
        ctx.setLineDash([10, 10]);
        ctx.lineWidth = 2;
        const centerX = 256 / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, 256);
        ctx.stroke();
        ctx.setLineDash([]);

        // Horizontal road markings
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * 32);
            ctx.lineTo(256, i * 32);
            ctx.stroke();
        }

        // Create texture from canvas
        const texture = new CanvasTexture(canvas);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(1, TRACK_LENGTH / 10);
        return texture;
    }, []);

    // Animate the track scrolling
    useFrame((_, delta) => {
        if (roadTexture) {
            offsetRef.current += delta * trackSpeed * 0.1;
            roadTexture.offset.set(0, -offsetRef.current);
        }
    });

    return (
        <group>
            {/* Main road surface with 5 lanes */}
            <mesh ref={trackRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -TRACK_LENGTH / 2 + 10]}>
                <planeGeometry args={[TRACK_WIDTH, TRACK_LENGTH]} />
                <meshStandardMaterial map={roadTexture} />
            </mesh>

            {/* Left edge barrier */}
            <mesh position={[-TRACK_WIDTH / 2 - 0.1, 0.3, -TRACK_LENGTH / 2 + 10]}>
                <boxGeometry args={[0.2, 0.6, TRACK_LENGTH]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>

            {/* Right edge barrier */}
            <mesh position={[TRACK_WIDTH / 2 + 0.1, 0.3, -TRACK_LENGTH / 2 + 10]}>
                <boxGeometry args={[0.2, 0.6, TRACK_LENGTH]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>
        </group>
    );
}

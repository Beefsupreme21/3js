import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { useTexture, Billboard } from '@react-three/drei';

const MOVE_SPEED = 5;
const ROTATION_SPEED = 3;
const MAX_BOUNDS = 15;
const NUM_ANGLES = 8; // 8 different boat angle sprites

export default function Boat() {
    const groupRef = useRef<Group>(null);
    const keysRef = useRef<Record<string, boolean>>({});
    const velocityRef = useRef(new Vector3(0, 0, 0));
    const [spriteIndex, setSpriteIndex] = useState(0);
    const lastSpriteIndexRef = useRef(0);
    
    // Load all 8 boat angle textures
    const boatTextures = useTexture([
        '/boat/Isometric Watercraft/PNG/watercraftPack_001_0.png',
        '/boat/Isometric Watercraft/PNG/watercraftPack_001_1.png',
        '/boat/Isometric Watercraft/PNG/watercraftPack_001_2.png',
        '/boat/Isometric Watercraft/PNG/watercraftPack_001_3.png',
        '/boat/Isometric Watercraft/PNG/watercraftPack_001_4.png',
        '/boat/Isometric Watercraft/PNG/watercraftPack_001_5.png',
        '/boat/Isometric Watercraft/PNG/watercraftPack_001_6.png',
        '/boat/Isometric Watercraft/PNG/watercraftPack_001_7.png',
    ]);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            keysRef.current[e.key.toLowerCase()] = true;
            if (e.key === 'ArrowLeft') keysRef.current['arrowleft'] = true;
            if (e.key === 'ArrowRight') keysRef.current['arrowright'] = true;
            if (e.key === 'ArrowUp') keysRef.current['arrowup'] = true;
            if (e.key === 'ArrowDown') keysRef.current['arrowdown'] = true;
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keysRef.current[e.key.toLowerCase()] = false;
            if (e.key === 'ArrowLeft') keysRef.current['arrowleft'] = false;
            if (e.key === 'ArrowRight') keysRef.current['arrowright'] = false;
            if (e.key === 'ArrowUp') keysRef.current['arrowup'] = false;
            if (e.key === 'ArrowDown') keysRef.current['arrowdown'] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Smooth movement
    useFrame((_, delta) => {
        if (!groupRef.current) return;

        const keys = keysRef.current;
        const targetVelocity = new Vector3(0, 0, 0);

        // Forward/backward movement
        if (keys['w'] || keys['arrowup']) {
            targetVelocity.z -= MOVE_SPEED;
        }
        if (keys['s'] || keys['arrowdown']) {
            targetVelocity.z += MOVE_SPEED;
        }

        // Left/right movement (strafe)
        if (keys['a'] || keys['arrowleft']) {
            targetVelocity.x -= MOVE_SPEED;
        }
        if (keys['d'] || keys['arrowright']) {
            targetVelocity.x += MOVE_SPEED;
        }

        // Rotate boat based on movement direction
        if (targetVelocity.length() > 0) {
            const angle = Math.atan2(targetVelocity.x, targetVelocity.z);
            const targetRotation = angle;
            groupRef.current.rotation.y += (targetRotation - groupRef.current.rotation.y) * ROTATION_SPEED * delta;
        }
        
        // Calculate which sprite to use based on rotation (0-7)
        // Normalize angle to 0-2π, then map to 0-7
        let normalizedAngle = groupRef.current.rotation.y;
        // Normalize to 0-2π
        while (normalizedAngle < 0) normalizedAngle += Math.PI * 2;
        while (normalizedAngle >= Math.PI * 2) normalizedAngle -= Math.PI * 2;
        
        // Map to sprite index (0-7)
        // Offset by π/8 to center the sprites properly
        const newSpriteIndex = Math.floor((normalizedAngle + Math.PI / NUM_ANGLES) / (Math.PI * 2 / NUM_ANGLES)) % NUM_ANGLES;
        
        // Debug: Log every 60 frames (about once per second)
        if (Math.floor(Date.now() / 1000) % 2 === 0 && Math.random() < 0.1) {
            console.log('Boat debug - Rotation:', normalizedAngle.toFixed(2), 'Sprite:', newSpriteIndex, 'Moving:', targetVelocity.length() > 0);
        }
        
        // Update sprite index state if it changed
        if (newSpriteIndex !== lastSpriteIndexRef.current) {
            lastSpriteIndexRef.current = newSpriteIndex;
            setSpriteIndex(newSpriteIndex);
            console.log('🎯 Changing sprite:', newSpriteIndex, 'Angle:', normalizedAngle.toFixed(2), 'Texture loaded:', !!boatTextures[newSpriteIndex]);
        }

        // Smooth velocity interpolation
        velocityRef.current.lerp(targetVelocity, 10 * delta);

        // Apply movement
        const moveAmount = velocityRef.current.clone().multiplyScalar(delta);
        groupRef.current.position.add(moveAmount);

        // Keep boat within bounds
        groupRef.current.position.x = Math.max(-MAX_BOUNDS, Math.min(MAX_BOUNDS, groupRef.current.position.x));
        groupRef.current.position.z = Math.max(-MAX_BOUNDS, Math.min(MAX_BOUNDS, groupRef.current.position.z));

        // Add slight bobbing motion on water
        groupRef.current.position.y = 0.1 + Math.sin(Date.now() * 0.002) * 0.05;
    });

    return (
        <group ref={groupRef} position={[0, 0.1, 0]}>
            {/* Boat sprite as billboard - always faces camera, using rotation-based sprite */}
            <Billboard position={[0, 0.1, 0]}>
                <mesh>
                    <planeGeometry args={[2.5, 2.5]} />
                    <meshBasicMaterial 
                        map={boatTextures[spriteIndex]} 
                        transparent 
                    />
                </mesh>
            </Billboard>
        </group>
    );
}


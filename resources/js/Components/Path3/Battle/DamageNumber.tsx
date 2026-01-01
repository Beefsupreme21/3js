import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { Text } from '@react-three/drei';

interface DamageNumberProps {
    position: [number, number, number];
    damage: number;
    onComplete: () => void;
}

export default function DamageNumber({ position, damage, onComplete }: DamageNumberProps) {
    const groupRef = useRef<Group>(null);
    const [opacity, setOpacity] = useState(1);
    let frame = 0;
    const maxFrames = 60; // 1 second at 60fps
    const floatDistance = 1.5;

    useFrame(() => {
        if (!groupRef.current) return;
        
        frame++;
        const progress = frame / maxFrames;
        
        // Float upward
        groupRef.current.position.y = position[1] + (progress * floatDistance);
        
        // Fade out
        setOpacity(1 - progress);
        
        if (progress >= 1) {
            onComplete();
        }
    });

    return (
        <group ref={groupRef} position={position}>
            <Text
                position={[0, 0, 0]}
                fontSize={0.4}
                color="#ff0000"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#000000"
                fillOpacity={opacity}
            >
                -{damage}
            </Text>
        </group>
    );
}


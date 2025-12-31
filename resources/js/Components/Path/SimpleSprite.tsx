import { useTexture } from '@react-three/drei';
import { NearestFilter } from 'three';

interface SimpleSpriteProps {
    position: [number, number, number];
    imagePath: string;
}

export default function SimpleSprite({ position, imagePath }: SimpleSpriteProps) {
    const texture = useTexture(imagePath);
    
    // Set pixel-perfect filtering (like Godot's "Filter" off setting)
    texture.minFilter = NearestFilter;
    texture.magFilter = NearestFilter;
    texture.generateMipmaps = false;
    
    return (
        <mesh position={position}>
            <planeGeometry args={[4, 4]} />
            <meshBasicMaterial map={texture} transparent />
        </mesh>
    );
}


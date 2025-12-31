import { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import { Texture } from 'three';

interface CharacterProps {
    position: [number, number, number];
    spriteX: number; // Column in sprite sheet (0-based)
    spriteY: number; // Row in sprite sheet (0-based)
}

const TILE_SIZE = 16;
const MARGIN = 1;
const SPRITE_SIZE = TILE_SIZE + MARGIN; // 17px total per sprite

export default function Character({ position, spriteX, spriteY }: CharacterProps) {
    // Load the sprite sheet
    const spriteSheet = useTexture('/path/Spritesheet/roguelikeChar_transparent.png');
    
    // Extract individual sprite using canvas
    const spriteTexture = useMemo(() => {
        if (!spriteSheet.image) return null;
        
        const sheetWidth = spriteSheet.image.width;
        const sheetHeight = spriteSheet.image.height;
        
        // Calculate source position in sprite sheet
        const sourceX = spriteX * SPRITE_SIZE + MARGIN;
        const sourceY = spriteY * SPRITE_SIZE + MARGIN;
        
        // Create canvas to extract the sprite
        const canvas = document.createElement('canvas');
        canvas.width = TILE_SIZE * 4; // Scale up 4x for better visibility
        canvas.height = TILE_SIZE * 4;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return null;
        
        // Enable pixel-perfect rendering
        ctx.imageSmoothingEnabled = false;
        
        // Draw the sprite from the sheet, scaled up
        ctx.drawImage(
            spriteSheet.image,
            sourceX,
            sourceY,
            TILE_SIZE,
            TILE_SIZE,
            0,
            0,
            TILE_SIZE * 4,
            TILE_SIZE * 4
        );
        
        const texture = new Texture(canvas);
        texture.needsUpdate = true;
        texture.flipY = false; // Don't flip Y for sprites
        return texture;
    }, [spriteSheet, spriteX, spriteY]);
    
    if (!spriteTexture) return null;
    
    return (
        <mesh position={position}>
            <planeGeometry args={[2, 2]} />
            <meshBasicMaterial map={spriteTexture} transparent />
        </mesh>
    );
}


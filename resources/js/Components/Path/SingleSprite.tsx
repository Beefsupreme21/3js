import { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import { Texture } from 'three';

interface SingleSpriteProps {
    position: [number, number, number];
    spriteX: number; // Column in sprite sheet (0-15 for 16x16 grid)
    spriteY: number; // Row in sprite sheet
}

const TILE_SIZE = 16;
const MARGIN = 1;
const SPRITE_SIZE = TILE_SIZE + MARGIN; // 17px total per sprite

export default function SingleSprite({ position, spriteX, spriteY }: SingleSpriteProps) {
    const spriteSheet = useTexture('/path/Spritesheet/roguelikeChar_transparent.png');
    
    const spriteTexture = useMemo(() => {
        const image = spriteSheet.image as HTMLImageElement | null;
        if (!image) return null;
        
        // Calculate source position
        const sourceX = spriteX * SPRITE_SIZE + MARGIN;
        const sourceY = spriteY * SPRITE_SIZE + MARGIN;
        
        // Create canvas to extract the sprite
        const canvas = document.createElement('canvas');
        canvas.width = TILE_SIZE * 4; // Scale up 4x
        canvas.height = TILE_SIZE * 4;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return null;
        
        // Enable pixel-perfect rendering
        ctx.imageSmoothingEnabled = false;
        
        // Flip canvas vertically
        ctx.translate(0, TILE_SIZE * 4);
        ctx.scale(1, -1);
        
        // Draw the sprite from the sheet
        ctx.drawImage(
            image,
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
        texture.flipY = false;
        return texture;
    }, [spriteSheet, spriteX, spriteY]);
    
    if (!spriteTexture) return null;
    
    return (
        <mesh position={position}>
            <planeGeometry args={[2, 2]} />
            <meshBasicMaterial map={spriteTexture} transparent alphaTest={0.1} />
        </mesh>
    );
}


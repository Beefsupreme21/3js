import { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import { Texture } from 'three';

const TILE_SIZE = 16;
const MARGIN = 1;
const SPRITE_SIZE = TILE_SIZE + MARGIN; // 17px total per sprite

interface SpriteProps {
    position: [number, number, number];
    spriteX: number;
    spriteY: number;
    spriteSheet: Texture;
}

function Sprite({ position, spriteX, spriteY, spriteSheet }: SpriteProps) {
    const spriteTexture = useMemo(() => {
        const image = spriteSheet.image as HTMLImageElement | null;
        if (!image) return null;
        
        // Calculate source position in sprite sheet
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
        
        // Flip the canvas context vertically before drawing
        ctx.translate(0, TILE_SIZE * 4);
        ctx.scale(1, -1);
        
        // Draw the sprite from the sheet, scaled up
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
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={spriteTexture} transparent />
        </mesh>
    );
}

export default function SpriteGrid() {
    const spriteSheet = useTexture('/path/Spritesheet/roguelikeChar_transparent.png');
    
    // Calculate grid dimensions
    const sprites = useMemo(() => {
        const image = spriteSheet.image as HTMLImageElement | null;
        if (!image) return [];
        
        const sheetWidth = image.width;
        const sheetHeight = image.height;
        
        const spritesPerRow = Math.floor(sheetWidth / SPRITE_SIZE);
        const spritesPerCol = Math.floor(sheetHeight / SPRITE_SIZE);
        
        const spriteList = [];
        const spacing = 1.2; // Space between sprites
        const startX = -(spritesPerRow * spacing) / 2;
        const startZ = (spritesPerCol * spacing) / 2;
        
        for (let y = 0; y < spritesPerCol; y++) {
            for (let x = 0; x < spritesPerRow; x++) {
                spriteList.push({
                    spriteX: x,
                    spriteY: y,
                    position: [
                        startX + x * spacing,
                        0,
                        startZ - y * spacing
                    ] as [number, number, number]
                });
            }
        }
        
        return spriteList;
    }, [spriteSheet]);
    
    return (
        <>
            <ambientLight intensity={0.8} />
            {sprites.map((sprite, index) => (
                <Sprite
                    key={`${sprite.spriteX}-${sprite.spriteY}-${index}`}
                    position={sprite.position}
                    spriteX={sprite.spriteX}
                    spriteY={sprite.spriteY}
                    spriteSheet={spriteSheet}
                />
            ))}
        </>
    );
}


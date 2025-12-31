import { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import { Texture, Vector2 } from 'three';

interface LayeredSpriteProps {
    position: [number, number, number];
    frameIndex: number; // Frame index (0-255 for 16x16 grid)
    layers: number[]; // Array of row indices for each layer (body, armor, weapon, etc.)
}

const TILE_SIZE = 16;
const MARGIN = 1;
const SPRITE_SIZE = TILE_SIZE + MARGIN; // 17px total per sprite
const GRID_SIZE = 16; // 16x16 grid

export default function LayeredSprite({ position, frameIndex, layers }: LayeredSpriteProps) {
    const spriteSheet = useTexture('/path/Spritesheet/roguelikeChar_transparent.png');
    
    // Create textures for each layer with proper UV mapping
    const layerTextures = useMemo(() => {
        const image = spriteSheet.image as HTMLImageElement | null;
        if (!image) return [];
        
        const sheetWidth = image.width;
        const sheetHeight = image.height;
        
        return layers.map((row) => {
            const spriteX = frameIndex % GRID_SIZE;
            const spriteY = row;
            
            // Calculate source position
            const sourceX = spriteX * SPRITE_SIZE + MARGIN;
            const sourceY = spriteY * SPRITE_SIZE + MARGIN;
            
            // Create canvas for this layer
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
        }).filter(Boolean) as Texture[];
    }, [spriteSheet, frameIndex, layers]);
    
    return (
        <group position={position}>
            {layerTextures.map((texture, index) => (
                <mesh key={index} position={[0, 0, index * 0.01]}>
                    <planeGeometry args={[2, 2]} />
                    <meshBasicMaterial 
                        map={texture} 
                        transparent 
                        alphaTest={0.1}
                        depthWrite={index === 0} // Only write depth for base layer
                    />
                </mesh>
            ))}
        </group>
    );
}


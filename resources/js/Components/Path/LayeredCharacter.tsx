import { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import { Texture, Vector2 } from 'three';

interface LayeredCharacterProps {
    position: [number, number, number];
    frameIndex: number; // Frame index (0-255 for 16x16 grid)
    bodyRow?: number; // Row in sprite sheet for body (default 0)
    armorRow?: number; // Row in sprite sheet for armor (optional)
    weaponRow?: number; // Row in sprite sheet for weapon (optional)
}

const TILE_SIZE = 16;
const MARGIN = 1;
const SPRITE_SIZE = TILE_SIZE + MARGIN; // 17px total per sprite
const GRID_SIZE = 16; // 16x16 grid

export default function LayeredCharacter({ 
    position, 
    frameIndex,
    bodyRow = 0,
    armorRow,
    weaponRow
}: LayeredCharacterProps) {
    const spriteSheet = useTexture('/path/Spritesheet/roguelikeChar_transparent.png');
    
    // Calculate UV coordinates for a frame in a specific row
    const getUVs = useMemo(() => {
        const image = spriteSheet.image as HTMLImageElement | null;
        if (!image) return null;
        
        const sheetWidth = image.width;
        const sheetHeight = image.height;
        
        return (row: number, frame: number) => {
            const spriteX = frame % GRID_SIZE;
            const spriteY = row;
            
            const u = (spriteX * SPRITE_SIZE + MARGIN) / sheetWidth;
            const v = 1 - ((spriteY * SPRITE_SIZE + MARGIN + TILE_SIZE) / sheetHeight);
            const uWidth = TILE_SIZE / sheetWidth;
            const vHeight = TILE_SIZE / sheetHeight;
            
            return { u, v, uWidth, vHeight };
        };
    }, [spriteSheet]);
    
    if (!getUVs) return null;
    
    const bodyUVs = getUVs(bodyRow, frameIndex);
    const armorUVs = armorRow !== undefined ? getUVs(armorRow, frameIndex) : null;
    const weaponUVs = weaponRow !== undefined ? getUVs(weaponRow, frameIndex) : null;
    
    return (
        <group position={position}>
            {/* Base body layer */}
            <mesh>
                <planeGeometry args={[2, 2]} />
                <meshBasicMaterial 
                    map={spriteSheet}
                    transparent
                >
                    <primitive 
                        object={spriteSheet.clone()} 
                        attach="map"
                    />
                </meshBasicMaterial>
            </mesh>
            
            {/* TODO: Apply UV offset for each layer */}
            {/* For now, just show the base body */}
        </group>
    );
}


import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The 12 sprites we want: columns 0 and 1, excluding rows 1,2,3,4,11,12,13,14
const SPRITES_TO_EXTRACT = [
    // Column 0
    { spriteX: 0, spriteY: 0, name: 'char_0_0' },
    { spriteX: 0, spriteY: 5, name: 'char_0_5' },
    { spriteX: 0, spriteY: 6, name: 'char_0_6' },
    { spriteX: 0, spriteY: 7, name: 'char_0_7' },
    { spriteX: 0, spriteY: 8, name: 'char_0_8' },
    { spriteX: 0, spriteY: 9, name: 'char_0_9' },
    { spriteX: 0, spriteY: 10, name: 'char_0_10' },
    // Column 1
    { spriteX: 1, spriteY: 0, name: 'char_1_0' },
    { spriteX: 1, spriteY: 5, name: 'char_1_5' },
    { spriteX: 1, spriteY: 6, name: 'char_1_6' },
    { spriteX: 1, spriteY: 7, name: 'char_1_7' },
    { spriteX: 1, spriteY: 8, name: 'char_1_8' },
    { spriteX: 1, spriteY: 9, name: 'char_1_9' },
    { spriteX: 1, spriteY: 10, name: 'char_1_10' },
];

const TILE_SIZE = 16;
const MARGIN = 1;
const SPRITE_SIZE = TILE_SIZE + MARGIN; // 17px total per sprite

async function extractSprites() {
    try {
        // Try to use sharp if available, otherwise use canvas
        let sharp;
        try {
            sharp = (await import('sharp')).default;
        } catch (e) {
            console.log('Sharp not found, trying canvas...');
            const { createCanvas, loadImage } = await import('canvas');
            
            const spriteSheetPath = path.join(__dirname, 'public/path/Spritesheet/roguelikeChar_transparent.png');
            const outputDir = path.join(__dirname, 'public/path/characters');
            
            // Create output directory
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            
            const image = await loadImage(spriteSheetPath);
            
            for (const sprite of SPRITES_TO_EXTRACT) {
                const sourceX = sprite.spriteX * SPRITE_SIZE + MARGIN;
                const sourceY = sprite.spriteY * SPRITE_SIZE + MARGIN;
                
                // Create canvas for the extracted sprite
                const canvas = createCanvas(TILE_SIZE, TILE_SIZE);
                const ctx = canvas.getContext('2d');
                
                // Draw the sprite from the sheet
                ctx.drawImage(
                    image,
                    sourceX,
                    sourceY,
                    TILE_SIZE,
                    TILE_SIZE,
                    0,
                    0,
                    TILE_SIZE,
                    TILE_SIZE
                );
                
                // Save as PNG
                const outputPath = path.join(outputDir, `${sprite.name}.png`);
                const buffer = canvas.toBuffer('image/png');
                fs.writeFileSync(outputPath, buffer);
                console.log(`Extracted: ${sprite.name}.png`);
            }
            
            console.log(`\n✅ Successfully extracted ${SPRITES_TO_EXTRACT.length} sprites to ${outputDir}`);
            return;
        }
        
        // Use sharp if available
        const spriteSheetPath = path.join(__dirname, 'public/path/Spritesheet/roguelikeChar_transparent.png');
        const outputDir = path.join(__dirname, 'public/path/characters');
        
        // Create output directory
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        for (const sprite of SPRITES_TO_EXTRACT) {
            const sourceX = sprite.spriteX * SPRITE_SIZE + MARGIN;
            const sourceY = sprite.spriteY * SPRITE_SIZE + MARGIN;
            
            await sharp(spriteSheetPath)
                .extract({
                    left: sourceX,
                    top: sourceY,
                    width: TILE_SIZE,
                    height: TILE_SIZE
                })
                .toFile(path.join(outputDir, `${sprite.name}.png`));
            
            console.log(`Extracted: ${sprite.name}.png`);
        }
        
        console.log(`\n✅ Successfully extracted ${SPRITES_TO_EXTRACT.length} sprites to ${outputDir}`);
    } catch (error) {
        console.error('Error extracting sprites:', error);
        process.exit(1);
    }
}

extractSprites();


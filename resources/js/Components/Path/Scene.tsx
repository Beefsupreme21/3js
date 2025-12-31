import SimpleSprite from './SimpleSprite';
import { Text } from '@react-three/drei';

// The 12 character PNGs we extracted with their class names
const CHARACTERS = [
    { name: 'char_0_0', label: 'Warrior' },
    { name: 'char_0_5', label: 'Hunter' },
    { name: 'char_0_6', label: 'Rogue' },
    { name: 'char_0_7', label: 'Mage' },
    { name: 'char_0_8', label: 'Paladin' },
    { name: 'char_0_9', label: 'Ranger' },
    { name: 'char_0_10', label: 'Cleric' },
    { name: 'char_1_0', label: 'Barbarian' },
    { name: 'char_1_5', label: 'Necromancer' },
    { name: 'char_1_6', label: 'Assassin' },
    { name: 'char_1_7', label: 'Druid' },
    { name: 'char_1_8', label: 'Monk' },
    { name: 'char_1_9', label: 'Bard' },
    { name: 'char_1_10', label: 'Sorcerer' },
];

export default function Scene() {
    const spacingX = 4;
    const spacingY = 8; // Much more vertical space between rows
    const itemsPerRow = 7;
    const startX = -((itemsPerRow - 1) * spacingX) / 2;
    const startY = spacingY / 2;

    return (
        <>
            <ambientLight intensity={0.8} />
            {CHARACTERS.map((char, index) => {
                const gridX = index % itemsPerRow;
                const gridY = Math.floor(index / itemsPerRow);
                const x = startX + gridX * spacingX;
                const y = startY - gridY * spacingY;
                
                return (
                    <group key={char.name} position={[x, y, 0]}>
                        <SimpleSprite
                            position={[0, 0, 0]}
                            imagePath={`/path/characters/${char.name}.png`}
                        />
                        <Text
                            position={[0, -2.3, 0]}
                            fontSize={0.4}
                            color="white"
                            anchorX="center"
                            anchorY="middle"
                        >
                            {char.label}
                        </Text>
                    </group>
                );
            })}
        </>
    );
}

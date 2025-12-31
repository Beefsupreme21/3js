import { usePath2 } from './Path2Context';
import { getCharacterComponent } from './Registry/CharacterRegistry';
import { Text } from '@react-three/drei';

export default function GameMap() {
    const { selectedTeam, chooseNode } = usePath2();

    const handleNodeClick = (type: 'fight' | 'town') => {
        chooseNode(type);
    };

    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <directionalLight position={[-5, 3, -5]} intensity={0.4} />

            {/* Display the 4 selected heroes */}
            <group position={[-6, 3, 0]}>
                {selectedTeam.map((characterType, index) => {
                    const CharacterComponent = getCharacterComponent(characterType);
                    return (
                        <group key={index} position={[index * 2, 0, 0]}>
                            <CharacterComponent position={[0, 0, 0]} />
                            <Text
                                position={[0, -1.5, 0]}
                                fontSize={0.3}
                                color="white"
                                anchorX="center"
                                anchorY="middle"
                            >
                                {characterType.charAt(0).toUpperCase() + characterType.slice(1)}
                            </Text>
                        </group>
                    );
                })}
            </group>

            {/* FTL-style map nodes */}
            <group position={[0, -3, 0]}>
                {/* Fight Node */}
                <group
                    position={[-4, 0, 0]}
                    onClick={() => handleNodeClick('fight')}
                    onPointerOver={(e) => {
                        e.stopPropagation();
                        document.body.style.cursor = 'pointer';
                    }}
                    onPointerOut={() => {
                        document.body.style.cursor = 'default';
                    }}
                >
                    {/* Outer ring */}
                    <mesh>
                        <ringGeometry args={[1.0, 1.2, 32]} />
                        <meshBasicMaterial color="#ff6666" />
                    </mesh>
                    {/* Inner circle */}
                    <mesh>
                        <circleGeometry args={[0.9, 32]} />
                        <meshBasicMaterial color="#ff2222" />
                    </mesh>
                    {/* Icon - sword */}
                    <mesh position={[0, 0, 0.1]} rotation={[0, 0, Math.PI / 4]}>
                        <boxGeometry args={[0.3, 0.8, 0.1]} />
                        <meshBasicMaterial color="#ffffff" />
                    </mesh>
                    <Text
                        position={[0, -1.3, 0.1]}
                        fontSize={0.35}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                    >
                        FIGHT
                    </Text>
                </group>

                {/* Town Node */}
                <group
                    position={[4, 0, 0]}
                    onClick={() => handleNodeClick('town')}
                    onPointerOver={(e) => {
                        e.stopPropagation();
                        document.body.style.cursor = 'pointer';
                    }}
                    onPointerOut={() => {
                        document.body.style.cursor = 'default';
                    }}
                >
                    {/* Outer ring */}
                    <mesh>
                        <ringGeometry args={[1.0, 1.2, 32]} />
                        <meshBasicMaterial color="#66ff66" />
                    </mesh>
                    {/* Inner circle */}
                    <mesh>
                        <circleGeometry args={[0.9, 32]} />
                        <meshBasicMaterial color="#22ff22" />
                    </mesh>
                    {/* Icon - house */}
                    <group position={[0, 0, 0.1]}>
                        <mesh position={[0, 0.2, 0]}>
                            <boxGeometry args={[0.5, 0.4, 0.1]} />
                            <meshBasicMaterial color="#ffffff" />
                        </mesh>
                        <mesh position={[0, 0.35, 0]} rotation={[0, 0, Math.PI / 4]}>
                            <coneGeometry args={[0.35, 0.3, 3]} />
                            <meshBasicMaterial color="#ffffff" />
                        </mesh>
                    </group>
                    <Text
                        position={[0, -1.3, 0.1]}
                        fontSize={0.35}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                    >
                        TOWN
                    </Text>
                </group>
            </group>
        </>
    );
}


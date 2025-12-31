import { usePath2 } from '../Path2Context';
import { getCharacterComponent } from '../Registry/CharacterRegistry';
import { getEnemyComponent } from '../Registry/EnemyRegistry';
import { Text } from '@react-three/drei';

export default function Fight() {
    const { selectedTeam } = usePath2();

    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <directionalLight position={[-5, 3, -5]} intensity={0.4} />

            {/* Display the 4 selected heroes on the left */}
            <group position={[-6, 0, 0]}>
                {selectedTeam.map((characterType, index) => {
                    const CharacterComponent = getCharacterComponent(characterType);
                    return (
                        <group key={index} position={[0, index * -2.5, 0]}>
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

            {/* Display the zombie enemy on the right */}
            <group position={[4, 0, 0]}>
                <group position={[0, 0, 0]}>
                    {(() => {
                        const ZombieComponent = getEnemyComponent('zombie');
                        return <ZombieComponent position={[0, 0, 0]} />;
                    })()}
                    <Text
                        position={[0, -1.5, 0]}
                        fontSize={0.3}
                        color="red"
                        anchorX="center"
                        anchorY="middle"
                    >
                        Zombie
                    </Text>
                </group>
            </group>
        </>
    );
}


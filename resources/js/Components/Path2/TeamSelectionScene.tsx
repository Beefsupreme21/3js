import { Warrior, Hunter, Mage, Warlock, Priest } from './Characters';
import { Text } from '@react-three/drei';

export default function TeamSelectionScene() {
    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <directionalLight position={[-5, 3, -5]} intensity={0.4} />
            
            {/* Warrior */}
            <group position={[-6, 0, 0]}>
                <Warrior position={[0, 0, 0]} />
                <Text
                    position={[0, -1.5, 0]}
                    fontSize={0.5}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    Warrior
                </Text>
            </group>
            
            {/* Hunter */}
            <group position={[-3, 0, 0]}>
                <Hunter position={[0, 0, 0]} />
                <Text
                    position={[0, -1.5, 0]}
                    fontSize={0.5}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    Hunter
                </Text>
            </group>
            
            {/* Mage */}
            <group position={[0, 0, 0]}>
                <Mage position={[0, 0, 0]} />
                <Text
                    position={[0, -1.5, 0]}
                    fontSize={0.5}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    Mage
                </Text>
            </group>
            
            {/* Warlock */}
            <group position={[3, 0, 0]}>
                <Warlock position={[0, 0, 0]} />
                <Text
                    position={[0, -1.5, 0]}
                    fontSize={0.5}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    Warlock
                </Text>
            </group>
            
            {/* Priest */}
            <group position={[6, 0, 0]}>
                <Priest position={[0, 0, 0]} />
                <Text
                    position={[0, -1.5, 0]}
                    fontSize={0.5}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    Priest
                </Text>
            </group>
        </>
    );
}


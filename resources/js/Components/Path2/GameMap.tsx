import { useMemo } from 'react';
import { usePath2 } from './Path2Context';
import { getCharacterComponent } from './Registry/CharacterRegistry';
import { Text } from '@react-three/drei';
import { BufferGeometry, Vector3 } from 'three';

export default function GameMap() {
    const { selectedTeam, chooseNode, mapNodes } = usePath2();

    const handleNodeClick = (nodeId: string) => {
        chooseNode(nodeId);
    };

    // Get node color and icon based on type
    const getNodeStyle = (type: string, visited: boolean, unlocked: boolean) => {
        const styles = {
            fight: { outer: '#ff6666', inner: '#ff2222', icon: '⚔️', label: 'FIGHT' },
            town: { outer: '#66ff66', inner: '#22ff22', icon: '🏠', label: 'TOWN' },
            event: { outer: '#6666ff', inner: '#2222ff', icon: '⭐', label: 'EVENT' },
        };
        const style = styles[type as keyof typeof styles] || styles.fight;
        
        if (visited) {
            return { ...style, outer: '#666666', inner: '#333333' };
        }
        if (!unlocked) {
            return { ...style, outer: '#333333', inner: '#111111' };
        }
        return style;
    };

    // Generate path lines connecting nodes based on connections
    // Lines connect parent nodes to their child nodes
    const pathLines = useMemo(() => {
        const lines: Array<{ from: Vector3; to: Vector3 }> = [];
        
        mapNodes.forEach(node => {
            if (node.connections.length > 0) {
                node.connections.forEach(connectedId => {
                    const connectedNode = mapNodes.find(n => n.id === connectedId);
                    if (connectedNode) {
                        // Calculate Y positions: level 0 at top, each level down by 3 units
                        const fromY = node.level * -3;
                        const toY = connectedNode.level * -3;
                        
                        lines.push({
                            from: new Vector3(node.position, fromY, 0),
                            to: new Vector3(connectedNode.position, toY, 0),
                        });
                    }
                });
            }
        });
        
        return lines;
    }, [mapNodes]);

    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <directionalLight position={[-5, 3, -5]} intensity={0.4} />

            {/* Display the 4 selected heroes in a left column */}
            <group position={[-8, 0, 0]}>
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

            {/* Path lines connecting nodes */}
            <group position={[0, 4, 0]}>
                {pathLines.map((line, index) => {
                    const geometry = new BufferGeometry().setFromPoints([line.from, line.to]);
                    return (
                        <line key={`path-${index}`} geometry={geometry}>
                            <lineBasicMaterial color="#ffff00" linewidth={2} />
                        </line>
                    );
                })}
            </group>

            {/* FTL-style map nodes - starting at top, flowing down */}
            <group position={[0, 4, 0]}>
                {mapNodes.map((node) => {
                    const yOffset = node.level * -3; // Negative Y goes down (level 0 at top, level 1 below, etc.)
                    const style = getNodeStyle(node.type, node.visited, node.unlocked);
                    const isClickable = !node.visited && node.unlocked;
                    
                    return (
                        <group
                            key={node.id}
                            position={[node.position, yOffset, 0]}
                            onClick={() => isClickable && handleNodeClick(node.id)}
                            onPointerOver={(e) => {
                                if (isClickable) {
                                    e.stopPropagation();
                                    document.body.style.cursor = 'pointer';
                                }
                            }}
                            onPointerOut={() => {
                                if (isClickable) {
                                    document.body.style.cursor = 'default';
                                }
                            }}
                        >
                            {/* Outer ring */}
                            <mesh>
                                <ringGeometry args={[1.0, 1.2, 32]} />
                                <meshBasicMaterial color={style.outer} />
                            </mesh>
                            {/* Inner circle */}
                            <mesh>
                                <circleGeometry args={[0.9, 32]} />
                                <meshBasicMaterial color={style.inner} />
                            </mesh>
                            
                            {/* Icon based on type */}
                            {node.type === 'fight' && (
                                <>
                                    <mesh position={[0, 0, 0.1]} rotation={[0, 0, Math.PI / 4]}>
                                        <boxGeometry args={[0.3, 0.8, 0.1]} />
                                        <meshBasicMaterial color="#ffffff" />
                                    </mesh>
                                </>
                            )}
                            
                            {node.type === 'town' && (
                                <>
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
                                </>
                            )}
                            
                            {node.type === 'event' && (
                                <>
                                    {/* Star icon made from multiple meshes */}
                                    <group position={[0, 0, 0.1]}>
                                        <mesh rotation={[0, 0, 0]}>
                                            <boxGeometry args={[0.3, 0.6, 0.1]} />
                                            <meshBasicMaterial color="#ffffff" />
                                        </mesh>
                                        <mesh rotation={[0, 0, Math.PI / 2]}>
                                            <boxGeometry args={[0.3, 0.6, 0.1]} />
                                            <meshBasicMaterial color="#ffffff" />
                                        </mesh>
                                        <mesh position={[0, 0, 0]}>
                                            <circleGeometry args={[0.15, 8]} />
                                            <meshBasicMaterial color="#ffff00" />
                                        </mesh>
                                    </group>
                                </>
                            )}
                            
                            <Text
                                position={[0, -1.3, 0.1]}
                                fontSize={0.35}
                                color={node.visited ? "#888888" : node.unlocked ? "white" : "#444444"}
                                anchorX="center"
                                anchorY="middle"
                            >
                                {style.label}
                            </Text>
                        </group>
                    );
                })}
            </group>
        </>
    );
}

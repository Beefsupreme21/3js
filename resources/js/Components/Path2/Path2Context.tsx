import { createContext, useContext, useState, ReactNode } from 'react';

export type CharacterType = 'warrior' | 'hunter' | 'mage' | 'warlock' | 'priest';
export type NodeType = 'fight' | 'town' | 'event';
export type GameScreen = 'title' | 'team-selection' | 'map' | 'fight' | 'town' | 'event';

export interface MapNode {
    id: string;
    type: NodeType;
    position: number;
    level: number;
    visited: boolean;
    unlocked: boolean;
    connections: string[]; // IDs of nodes this connects to
}

interface Path2ContextType {
    selectedTeam: CharacterType[];
    selectCharacter: (character: CharacterType) => void;
    removeCharacter: (index: number) => void;
    isGameStarted: boolean;
    startGame: () => void;
    showTitle: boolean;
    hideTitle: () => void;
    chooseNode: (nodeId: string) => void;
    currentNode: NodeType | null;
    currentScreen: GameScreen;
    setScreen: (screen: GameScreen) => void;
    mapNodes: MapNode[];
    nodesVisited: number;
}

export const Path2Context = createContext<Path2ContextType | undefined>(undefined);

// Generate random node type based on progression
const getRandomNodeType = (nodesVisited: number): NodeType => {
    const rand = Math.random();
    // Early game: more towns, fewer events
    // Late game: more fights and events
    if (nodesVisited < 5) {
        if (rand < 0.4) return 'town';
        if (rand < 0.85) return 'fight';
        return 'event';
    } else if (nodesVisited < 15) {
        if (rand < 0.3) return 'town';
        if (rand < 0.7) return 'fight';
        return 'event';
    } else {
        if (rand < 0.25) return 'town';
        if (rand < 0.6) return 'fight';
        return 'event';
    }
};

export function Path2Provider({ children }: { children: ReactNode }) {
    const [selectedTeam, setSelectedTeam] = useState<CharacterType[]>([]);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [showTitle, setShowTitle] = useState(true);
    const [currentNode, setCurrentNode] = useState<NodeType | null>(null);
    const [currentScreen, setCurrentScreen] = useState<GameScreen>('title');
    const [mapNodes, setMapNodes] = useState<MapNode[]>([]);
    const [nodesVisited, setNodesVisited] = useState(0);

    const selectCharacter = (character: CharacterType) => {
        if (selectedTeam.length < 4 && !selectedTeam.includes(character)) {
            setSelectedTeam([...selectedTeam, character]);
        }
    };

    const removeCharacter = (index: number) => {
        setSelectedTeam(selectedTeam.filter((_, i) => i !== index));
    };

    const generateChildrenForNode = (parentNodeId: string) => {
        setMapNodes(prev => {
            const parentNode = prev.find(n => n.id === parentNodeId);
            if (!parentNode || parentNode.connections.length > 0) {
                // Children already exist or node doesn't exist
                return prev;
            }
            
            const nextLevel = parentNode.level + 1;
            // Use a timestamp-based ID to ensure uniqueness
            const timestamp = Date.now();
            
            // Generate 2 children for this parent
            const leftChild: MapNode = {
                id: `node-${timestamp}-1`,
                type: getRandomNodeType(nodesVisited),
                position: parentNode.position - 4,
                level: nextLevel,
                visited: false,
                unlocked: true, // Unlock immediately since parent is visited
                connections: [],
            };
            
            const rightChild: MapNode = {
                id: `node-${timestamp}-2`,
                type: getRandomNodeType(nodesVisited + 1),
                position: parentNode.position + 4,
                level: nextLevel,
                visited: false,
                unlocked: true, // Unlock immediately since parent is visited
                connections: [],
            };
            
            // Update parent with connections
            const updatedParent = {
                ...parentNode,
                connections: [leftChild.id, rightChild.id],
            };
            
            return prev.map(n => n.id === parentNodeId ? updatedParent : n)
                .concat([leftChild, rightChild]);
        });
    };

    const startGame = () => {
        if (selectedTeam.length === 4) {
            setIsGameStarted(true);
            setCurrentScreen('map');
            // Create starting node
            const startNode: MapNode = {
                id: 'start',
                type: 'town',
                position: 0,
                level: 0,
                visited: true,
                unlocked: true,
                connections: [],
            };
            setMapNodes([startNode]);
            // Generate first level nodes from start
            setMapNodes(prev => {
                const newNodes: MapNode[] = [
                    {
                        id: 'node-1',
                        type: getRandomNodeType(0),
                        position: -4,
                        level: 1,
                        visited: false,
                        unlocked: true,
                        connections: [],
                    },
                    {
                        id: 'node-2',
                        type: getRandomNodeType(1),
                        position: 4,
                        level: 1,
                        visited: false,
                        unlocked: true,
                        connections: [],
                    },
                ];
                // Update start node with connections
                const updatedStart = {
                    ...startNode,
                    connections: ['node-1', 'node-2'],
                };
                return [updatedStart, ...newNodes];
            });
        }
    };

    const hideTitle = () => {
        setShowTitle(false);
        setCurrentScreen('team-selection');
    };

    const chooseNode = (nodeId: string) => {
        setMapNodes(prev => {
            const node = prev.find(n => n.id === nodeId);
            if (!node || node.visited || !node.unlocked) return prev;
            
            // Mark node as visited
            const updatedNodes = prev.map(n => 
                n.id === nodeId ? { ...n, visited: true } : n
            );
            
            setCurrentNode(node.type);
            setNodesVisited(prevCount => prevCount + 1);
            
            // Navigate to appropriate screen
            if (node.type === 'fight') {
                setCurrentScreen('fight');
            } else if (node.type === 'town') {
                setCurrentScreen('town');
            } else if (node.type === 'event') {
                setCurrentScreen('event');
            }
            
            return updatedNodes;
        });
        
        // Generate children for this specific node immediately
        generateChildrenForNode(nodeId);
    };

    return (
        <Path2Context.Provider
            value={{
                selectedTeam,
                selectCharacter,
                removeCharacter,
                isGameStarted,
                startGame,
                showTitle,
                hideTitle,
                chooseNode,
                currentNode,
                currentScreen,
                setScreen: setCurrentScreen,
                mapNodes,
                nodesVisited,
            }}
        >
            {children}
        </Path2Context.Provider>
    );
}

export function usePath2() {
    const context = useContext(Path2Context);
    if (!context) {
        throw new Error('usePath2 must be used within Path2Provider');
    }
    return context;
}


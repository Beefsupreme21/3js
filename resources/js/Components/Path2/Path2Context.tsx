import { createContext, useContext, useState, ReactNode } from 'react';

type CharacterType = 'warrior' | 'hunter' | 'mage' | 'warlock' | 'priest';
type NodeType = 'fight' | 'town';
type GameScreen = 'title' | 'team-selection' | 'map' | 'fight' | 'town';

interface Path2ContextType {
    selectedTeam: CharacterType[];
    selectCharacter: (character: CharacterType) => void;
    removeCharacter: (index: number) => void;
    isGameStarted: boolean;
    startGame: () => void;
    showTitle: boolean;
    hideTitle: () => void;
    chooseNode: (nodeType: NodeType) => void;
    currentNode: NodeType | null;
    currentScreen: GameScreen;
    setScreen: (screen: GameScreen) => void;
}

const Path2Context = createContext<Path2ContextType | undefined>(undefined);

export function Path2Provider({ children }: { children: ReactNode }) {
    const [selectedTeam, setSelectedTeam] = useState<CharacterType[]>([]);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [showTitle, setShowTitle] = useState(true);
    const [currentNode, setCurrentNode] = useState<NodeType | null>(null);
    const [currentScreen, setCurrentScreen] = useState<GameScreen>('title');

    const selectCharacter = (character: CharacterType) => {
        if (selectedTeam.length < 4 && !selectedTeam.includes(character)) {
            setSelectedTeam([...selectedTeam, character]);
        }
    };

    const removeCharacter = (index: number) => {
        setSelectedTeam(selectedTeam.filter((_, i) => i !== index));
    };

    const startGame = () => {
        if (selectedTeam.length === 4) {
            setIsGameStarted(true);
            setCurrentScreen('map');
        }
    };

    const hideTitle = () => {
        setShowTitle(false);
        setCurrentScreen('team-selection');
    };

    const chooseNode = (nodeType: NodeType) => {
        setCurrentNode(nodeType);
        if (nodeType === 'fight') {
            setCurrentScreen('fight');
        } else if (nodeType === 'town') {
            setCurrentScreen('town');
        }
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


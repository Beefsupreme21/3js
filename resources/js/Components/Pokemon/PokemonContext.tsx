import { createContext, useContext, useState, ReactNode } from 'react';

interface PokemonContextType {
    isGameStarted: boolean;
    startGame: () => void;
}

const PokemonContext = createContext<PokemonContextType | null>(null);

export function PokemonProvider({ children }: { children: ReactNode }) {
    const [isGameStarted, setIsGameStarted] = useState(false);

    const startGame = () => {
        setIsGameStarted(true);
    };

    return (
        <PokemonContext.Provider
            value={{
                isGameStarted,
                startGame,
            }}
        >
            {children}
        </PokemonContext.Provider>
    );
}

export function usePokemon() {
    const context = useContext(PokemonContext);
    if (!context) {
        throw new Error('usePokemon must be used within a PokemonProvider');
    }
    return context;
}


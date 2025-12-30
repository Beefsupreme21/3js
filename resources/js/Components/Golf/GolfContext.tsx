import { createContext, useContext, useState, ReactNode } from 'react';

interface GolfContextType {
    isGameStarted: boolean;
    startGame: () => void;
}

const GolfContext = createContext<GolfContextType | null>(null);

export function GolfProvider({ children }: { children: ReactNode }) {
    const [isGameStarted, setIsGameStarted] = useState(false);

    const startGame = () => {
        setIsGameStarted(true);
    };

    return (
        <GolfContext.Provider
            value={{
                isGameStarted,
                startGame,
            }}
        >
            {children}
        </GolfContext.Provider>
    );
}

export function useGolf() {
    const context = useContext(GolfContext);
    if (!context) {
        throw new Error('useGolf must be used within a GolfProvider');
    }
    return context;
}


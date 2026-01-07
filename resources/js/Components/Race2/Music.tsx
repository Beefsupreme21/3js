import { useEffect, useRef } from 'react';
import { useGame } from './GameContext';

export default function Music() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { isGameStarted, isGameOver, volume } = useGame();

    useEffect(() => {
        // Create audio element once
        if (!audioRef.current) {
            audioRef.current = new Audio('/audio/synthwave.mp4');
            audioRef.current.loop = true;
        }

        const audio = audioRef.current;

        if (isGameStarted && !isGameOver) {
            audio.play().catch(() => {
                // Autoplay might be blocked, that's ok
            });
        }
    }, [isGameStarted, isGameOver]);

    // Update volume based on context and game state
    useEffect(() => {
        if (audioRef.current) {
            if (isGameOver) {
                // Lower volume on death (30% of normal)
                audioRef.current.volume = volume * 0.3;
            } else {
                // Normal volume
                audioRef.current.volume = volume;
            }
        }
    }, [volume, isGameOver]);

    return null; // This component doesn't render anything
}

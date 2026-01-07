import { useFrame } from '@react-three/fiber';
import { useGame, getGearMaxSpeed } from './GameContext';

const ACCELERATION_RATE = 8.0; // How fast speed increases (units per second squared)
const DECELERATION_RATE = 12.0; // How fast speed decreases (faster when downshifting)

export default function SpeedController() {
    const { gear, currentSpeed } = useGame();

    useFrame((_, delta) => {
        // Get target speed for current gear
        const targetSpeed = getGearMaxSpeed(gear);

        // Gradually accelerate/decelerate toward target speed
        const current = currentSpeed.current;
        const diff = targetSpeed - current;

        if (Math.abs(diff) < 0.1) {
            // Close enough, snap to target
            currentSpeed.current = targetSpeed;
        } else if (diff > 0) {
            // Accelerating (shifting up or in same gear)
            const acceleration = ACCELERATION_RATE * delta;
            currentSpeed.current = Math.min(targetSpeed, current + acceleration);
        } else {
            // Decelerating (shifting down)
            const deceleration = DECELERATION_RATE * delta;
            currentSpeed.current = Math.max(targetSpeed, current - deceleration);
        }
    });

    return null; // This component doesn't render anything
}

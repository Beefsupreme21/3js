import { useFrame, useThree } from '@react-three/fiber';
import { useGolf } from './GolfContext';
import { Vector3 } from 'three';

const GOLFER_POSITION = new Vector3(-0.5, 0, 0.3);
const BALL_POSITION = new Vector3(0, 0.1, 0);
const CAMERA_OFFSET = new Vector3(0, 1.5, 3); // Behind and slightly above

export default function CameraController() {
    const { camera } = useThree();
    const { isGameStarted } = useGolf();

    useFrame(() => {
        if (!isGameStarted) return;

        // Position camera behind golfer
        const cameraPosition = GOLFER_POSITION.clone().add(CAMERA_OFFSET);
        camera.position.lerp(cameraPosition, 0.1); // Smooth camera movement

        // Look at the ball
        camera.lookAt(BALL_POSITION);
    });

    return null;
}


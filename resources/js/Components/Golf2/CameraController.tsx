import { useFrame, useThree } from '@react-three/fiber';
import { useGolf2 } from './Golf2Context';
import { Vector3 } from 'three';

const HOLE_POSITION = new Vector3(12, 0, -30); // Flag position (moved right)

export default function CameraController() {
    const { camera } = useThree();
    const { ballPosition, ballVelocity } = useGolf2();

    useFrame(() => {
        const [vx, vy, vz] = ballVelocity;
        const isMoving = vx !== 0 || vy !== 0 || vz !== 0;

        if (!isMoving) {
            const ballPos = new Vector3(ballPosition[0], ballPosition[1], ballPosition[2]);
            
            // Calculate direction from ball to flag
            const directionToFlag = new Vector3()
                .subVectors(HOLE_POSITION, ballPos)
                .normalize();

            // Position camera behind and above the ball, so ball appears in bottom center
            // Camera should be behind the ball (opposite of flag direction) and elevated
            const cameraDistance = 8; // Distance behind ball
            const cameraHeight = 3; // Height above ball
            
            // Position camera behind ball (opposite direction from flag)
            const behindDirection = directionToFlag.clone().multiplyScalar(-1);
            const targetCameraPos = new Vector3()
                .copy(ballPos)
                .add(behindDirection.multiplyScalar(cameraDistance))
                .add(new Vector3(0, cameraHeight, 0));

            // Look at the flag
            const lookAtPoint = HOLE_POSITION.clone();

            // Smoothly move camera
            camera.position.lerp(targetCameraPos, 0.05);
            camera.lookAt(lookAtPoint);
        }
    });

    return null;
}


import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGolf3 } from './Golf3Context';
import { Vector3 } from 'three';

const HOLE_POSITION = new Vector3(5, 0, -35); // Flag position (at end of curved fairway)
const FOLLOW_DELAY = 1.5; // Wait 1.5 seconds before following

export default function CameraController() {
    const { camera } = useThree();
    const { ballPosition, ballVelocity } = useGolf3();
    const ballStartTimeRef = useRef<number | null>(null);
    const wasMovingRef = useRef(false);

    useFrame((state) => {
        const [vx, vy, vz] = ballVelocity;
        const isMoving = vx !== 0 || vy !== 0 || vz !== 0;
        const currentTime = state.clock.elapsedTime;

        // Track when ball starts moving
        if (isMoving && !wasMovingRef.current) {
            ballStartTimeRef.current = currentTime;
        }
        wasMovingRef.current = isMoving;

        // If ball is not moving, always follow
        // If ball is moving, wait for delay before following
        const shouldFollow = !isMoving || 
            (ballStartTimeRef.current !== null && 
             currentTime - ballStartTimeRef.current >= FOLLOW_DELAY);

        if (shouldFollow) {
            const ballPos = new Vector3(ballPosition[0], ballPosition[1], ballPosition[2]);
            
            // Calculate direction from ball to flag
            const directionToFlag = new Vector3()
                .subVectors(HOLE_POSITION, ballPos)
                .normalize();

            // Position camera behind and above the ball, so ball appears in bottom center
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


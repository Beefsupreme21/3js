import Course from './Course';
import GolfBall from './GolfBall';
import Golfer from './Golfer';
import CameraController from './CameraController';

export default function Scene() {
    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
            <directionalLight position={[-10, 5, -5]} intensity={0.5} color="#ffffff" />

            {/* Camera controller - follows behind golfer */}
            <CameraController />

            {/* Course */}
            <Course />

            {/* Golfer character */}
            <Golfer />

            {/* Golf ball */}
            <GolfBall />
        </>
    );
}


import Player from './Player';
import Track from './Track';
import SpeedController from './SpeedController';

export default function Scene() {
    return (
        <>
            {/* Speed controller - handles gradual acceleration */}
            <SpeedController />

            {/* Ambient light for overall illumination */}
            <ambientLight intensity={0.5} />

            {/* Main directional light */}
            <directionalLight position={[0, 10, 5]} intensity={1} color="#ffffff" />

            {/* The track/road with 5 lanes */}
            <Track />

            {/* The player car */}
            <Player />
        </>
    );
}

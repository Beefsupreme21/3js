import Player from './Player';
import Track from './Track';
import ObstacleManager from './ObstacleManager';
import Explosion from './Explosion';
import Sun from './Sun';
import SpeedLines from './SpeedLines';

export default function Scene() {
    return (
        <>
            {/* Synthwave sun */}
            <Sun />

            {/* Ambient light for overall illumination */}
            <ambientLight intensity={0.5} />

            {/* Main directional light */}
            <directionalLight position={[0, 10, 5]} intensity={1} color="#ffffff" />

            {/* Colored accent lights for neon atmosphere */}
            <pointLight position={[-8, 8, 0]} intensity={100} color="#ff00ff" distance={50} />
            <pointLight position={[8, 8, 0]} intensity={100} color="#00ffff" distance={50} />
            <pointLight position={[0, 5, -20]} intensity={80} color="#ff00ff" distance={40} />

            {/* The track/road */}
            <Track />

            {/* The player ship */}
            <Player />

            {/* Speed lines when boosting */}
            <SpeedLines />

            {/* Obstacles to dodge */}
            <ObstacleManager />

            {/* Explosion effect */}
            <Explosion />
        </>
    );
}

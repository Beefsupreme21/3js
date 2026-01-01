import { usePath2 } from './Path2Context';
import TeamSelectionScene from './TeamSelectionScene';
import GameMap from './GameMap';
import Fight from './Locations/Fight';

export default function Scene() {
    const { currentScreen } = usePath2();

    switch (currentScreen) {
        case 'title':
        case 'team-selection':
            return <TeamSelectionScene />;
        case 'map':
            return <GameMap />;
        case 'fight':
            return <Fight />;
        case 'town':
            // TODO: Add Town component
            return <GameMap />;
        case 'event':
            // TODO: Add Event component
            return <GameMap />;
        default:
            return <TeamSelectionScene />;
    }
}


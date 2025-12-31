import { usePath2 } from './Path2Context';

export default function TitleScreen() {
    const { showTitle, hideTitle } = usePath2();
    
    if (!showTitle) return null;
    
    return (
        <div 
            className="absolute inset-0 flex items-center justify-center bg-black/80 z-50 cursor-pointer"
            onClick={hideTitle}
        >
            <div className="text-center">
                <h1 className="text-6xl font-bold text-white mb-4">PATH</h1>
                <p className="text-2xl text-white/80 mb-8">Choose Your Team</p>
                <p className="text-lg text-white/60">Click to start</p>
            </div>
        </div>
    );
}


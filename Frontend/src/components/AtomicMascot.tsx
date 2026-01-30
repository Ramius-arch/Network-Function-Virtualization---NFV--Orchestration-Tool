import React, { useState, useEffect } from 'react';

interface AtomicMascotProps {
    tips?: string[];
    contextTip?: string;
    position?: 'bottom-right' | 'bottom-left';
}

const defaultTips = [
    "Welcome to the Command Center! I'm your operational companion.",
    'Tip: Each grid tile holds a specific operational domain.',
    'Did you know? The network hub is centered for maximum visibility.',
    'Need help? Use the tutorial to master the zero-scroll layout!',
    'Pro tip: Accessibility controls are now pinned to the bottom right.',
];

const AtomicMascot: React.FC<AtomicMascotProps> = ({
    tips = defaultTips,
    contextTip,
    position = 'bottom-right',
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentTip, setCurrentTip] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (!contextTip && isExpanded) {
            const interval = setInterval(() => {
                setCurrentTip((prev) => (prev + 1) % tips.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [isExpanded, tips.length, contextTip]);

    const displayTip = contextTip || tips[currentTip];

    const positionClasses =
        position === 'bottom-right' ? 'right-4 bottom-4' : 'left-4 bottom-4';

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className={`fixed ${positionClasses} z-50 w-12 h-12 rounded-full bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30 transition-all hover-scale`}
                aria-label="Show Atomic mascot"
            >
                <span className="text-xl">⚛️</span>
            </button>
        );
    }

    return (
        <div className={`fixed ${positionClasses} z-50 flex flex-col items-end gap-2`}>
            {/* Speech Bubble */}
            {isExpanded && (
                <div className="speech-bubble max-w-xs animate-fade-in text-sm text-text">
                    <p>{displayTip}</p>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-primary/20">
                        <button
                            onClick={() => setCurrentTip((prev) => (prev + 1) % tips.length)}
                            className="text-xs text-primary hover:text-secondary transition-colors"
                        >
                            Next tip →
                        </button>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-xs text-error/70 hover:text-error transition-colors"
                        >
                            Hide
                        </button>
                    </div>
                </div>
            )}

            {/* Mascot Character */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`relative w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary hover:border-secondary transition-all hover-lift ${isExpanded ? 'ring-2 ring-primary/50' : ''
                    }`}
                aria-label={isExpanded ? 'Collapse tips' : 'Expand tips'}
            >
                {/* Animated Core */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse-glow flex items-center justify-center">
                    <span className="text-2xl animate-float">⚛️</span>
                </div>

                {/* Orbiting Electrons */}
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
                    <div className="absolute top-0 left-1/2 w-2 h-2 -ml-1 rounded-full bg-accent" />
                </div>
                <div
                    className="absolute inset-0 animate-spin"
                    style={{ animationDuration: '6s', animationDirection: 'reverse' }}
                >
                    <div className="absolute bottom-0 left-1/2 w-2 h-2 -ml-1 rounded-full bg-secondary" />
                </div>

                {/* Notification Badge */}
                {!isExpanded && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-background text-xs flex items-center justify-center animate-bounce-slow">
                        ?
                    </span>
                )}
            </button>
        </div>
    );
};

export default AtomicMascot;

import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

const AccessibilityPanel: React.FC = () => {
    const { fontSize, setFontSize, highContrast, toggleHighContrast } = useAccessibility();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed left-4 top-1/2 -translate-y-1/2 z-[100]">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all bg-black/40 border border-primary/50 text-text hover:bg-black/60 hover-scale ${isOpen ? 'rotate-90 border-secondary' : ''
                    }`}
                aria-label="Accessibility settings"
            >
                <span className="text-xl">♿</span>
            </button>

            {/* Settings Panel */}
            {isOpen && (
                <div className="absolute left-14 top-0 -translate-y-1/2 w-64 p-4 bg-black/80 backdrop-blur-xl border border-primary/30 rounded-xl shadow-2xl animate-slide-in">
                    <h3 className="text-lg font-bold text-primary font-orbitron mb-4 border-b border-primary/20 pb-2">
                        Accessibility
                    </h3>

                    <div className="space-y-6">
                        {/* Font Size */}
                        <div className="space-y-2">
                            <span className="text-xs uppercase text-text/50 font-mono">Font Size</span>
                            <div className="flex gap-2">
                                {(['small', 'medium', 'large'] as const).map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setFontSize(size)}
                                        className={`flex-1 py-1 text-xs border rounded transition-all ${fontSize === size
                                                ? 'bg-primary text-background border-primary font-bold'
                                                : 'border-primary/30 text-text/70 hover:border-primary'
                                            }`}
                                    >
                                        {size.charAt(0).toUpperCase() + size.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* High Contrast */}
                        <div className="flex items-center justify-between">
                            <span className="text-xs uppercase text-text/50 font-mono">High Contrast</span>
                            <button
                                onClick={toggleHighContrast}
                                className={`relative w-10 h-5 rounded-full transition-all ${highContrast ? 'bg-secondary' : 'bg-primary/20'
                                    }`}
                            >
                                <div
                                    className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${highContrast ? 'left-6' : 'left-1'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Hint */}
                        <p className="text-[10px] text-text/40 italic leading-tight">
                            Settings are saved automatically for your next session.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccessibilityPanel;

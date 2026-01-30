import React, { useEffect, useState } from 'react';
import { useTutorial } from '../context/TutorialContext';

const TutorialOverlay: React.FC = () => {
    const { isActive, currentStep, steps, nextStep, prevStep, skipTutorial } = useTutorial();
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    const step = steps[currentStep];

    useEffect(() => {
        if (!isActive || !step?.targetSelector) {
            setTargetRect(null);
            return;
        }

        const target = document.querySelector(step.targetSelector);
        if (target) {
            const rect = target.getBoundingClientRect();
            setTargetRect(rect);
            target.classList.add('tutorial-highlight');
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        return () => {
            const el = document.querySelector('.tutorial-highlight');
            el?.classList.remove('tutorial-highlight');
        };
    }, [isActive, step]);

    if (!isActive || !step) return null;

    const getTooltipPosition = () => {
        if (!targetRect) {
            return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
        }

        const padding = 16;
        const position = step.position || 'bottom';

        switch (position) {
            case 'top':
                return {
                    bottom: `${window.innerHeight - targetRect.top + padding}px`,
                    left: `${targetRect.left + targetRect.width / 2}px`,
                    transform: 'translateX(-50%)',
                };
            case 'bottom':
                return {
                    top: `${targetRect.bottom + padding}px`,
                    left: `${targetRect.left + targetRect.width / 2}px`,
                    transform: 'translateX(-50%)',
                };
            case 'left':
                return {
                    top: `${targetRect.top + targetRect.height / 2}px`,
                    right: `${window.innerWidth - targetRect.left + padding}px`,
                    transform: 'translateY(-50%)',
                };
            case 'right':
                return {
                    top: `${targetRect.top + targetRect.height / 2}px`,
                    left: `${targetRect.right + padding}px`,
                    transform: 'translateY(-50%)',
                };
            default:
                return {
                    top: `${targetRect.bottom + padding}px`,
                    left: `${targetRect.left + targetRect.width / 2}px`,
                    transform: 'translateX(-50%)',
                };
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div className="tutorial-backdrop" onClick={skipTutorial} />

            {/* Tooltip */}
            <div
                className="fixed z-[1001] max-w-sm bg-background border border-primary rounded-lg shadow-xl animate-fade-in"
                style={getTooltipPosition()}
            >
                <div className="p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-primary">{step.title}</h3>
                        <span className="text-xs text-text/60">
                            {currentStep + 1} / {steps.length}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-text/80 mb-4">{step.description}</p>

                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-primary/20 rounded-full mb-4">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={skipTutorial}
                            className="text-xs text-text/50 hover:text-text transition-colors"
                        >
                            Skip tutorial
                        </button>
                        <div className="flex gap-2">
                            {currentStep > 0 && (
                                <button
                                    onClick={prevStep}
                                    className="px-3 py-1 text-sm border border-primary/50 text-primary rounded hover:bg-primary/10 transition-colors"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                onClick={nextStep}
                                className="px-3 py-1 text-sm bg-primary text-background rounded hover:bg-secondary transition-colors"
                            >
                                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TutorialOverlay;

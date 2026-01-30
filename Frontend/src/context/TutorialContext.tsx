import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface TutorialStep {
    id: string;
    title: string;
    description: string;
    targetSelector?: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TutorialContextType {
    isActive: boolean;
    currentStep: number;
    steps: TutorialStep[];
    startTutorial: (steps: TutorialStep[]) => void;
    nextStep: () => void;
    prevStep: () => void;
    skipTutorial: () => void;
    completeTutorial: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

const TUTORIAL_COMPLETED_KEY = 'atomic-tutorial-completed';

interface TutorialProviderProps {
    children: ReactNode;
}

export const TutorialProvider: React.FC<TutorialProviderProps> = ({ children }) => {
    const [isActive, setIsActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [steps, setSteps] = useState<TutorialStep[]>([]);

    const startTutorial = useCallback((tutorialSteps: TutorialStep[]) => {
        const completed = localStorage.getItem(TUTORIAL_COMPLETED_KEY);
        if (completed === 'true') return;

        setSteps(tutorialSteps);
        setCurrentStep(0);
        setIsActive(true);
    }, []);

    const nextStep = useCallback(() => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            completeTutorial();
        }
    }, [currentStep, steps.length]);

    const prevStep = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    }, [currentStep]);

    const skipTutorial = useCallback(() => {
        setIsActive(false);
        setCurrentStep(0);
        setSteps([]);
    }, []);

    const completeTutorial = useCallback(() => {
        localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
        setIsActive(false);
        setCurrentStep(0);
        setSteps([]);
    }, []);

    return (
        <TutorialContext.Provider
            value={{
                isActive,
                currentStep,
                steps,
                startTutorial,
                nextStep,
                prevStep,
                skipTutorial,
                completeTutorial,
            }}
        >
            {children}
        </TutorialContext.Provider>
    );
};

export const useTutorial = (): TutorialContextType => {
    const context = useContext(TutorialContext);
    if (!context) {
        throw new Error('useTutorial must be used within a TutorialProvider');
    }
    return context;
};

// Reset tutorial for development/testing
export const resetTutorial = () => {
    localStorage.removeItem(TUTORIAL_COMPLETED_KEY);
};

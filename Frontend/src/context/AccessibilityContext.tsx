import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type FontSize = 'small' | 'medium' | 'large';

interface AccessibilityContextType {
    fontSize: FontSize;
    highContrast: boolean;
    setFontSize: (size: FontSize) => void;
    toggleHighContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const FONT_SIZE_KEY = 'atomic-font-size';
const HIGH_CONTRAST_KEY = 'atomic-high-contrast';

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [fontSize, setFontSizeState] = useState<FontSize>(
        (localStorage.getItem(FONT_SIZE_KEY) as FontSize) || 'medium'
    );
    const [highContrast, setHighContrastState] = useState(
        localStorage.getItem(HIGH_CONTRAST_KEY) === 'true'
    );

    useEffect(() => {
        // Apply font size class to body
        const root = document.documentElement;
        root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
        root.classList.add(`font-size-${fontSize}`);
        localStorage.setItem(FONT_SIZE_KEY, fontSize);
    }, [fontSize]);

    useEffect(() => {
        // Apply high contrast class to body
        const root = document.documentElement;
        if (highContrast) {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }
        localStorage.setItem(HIGH_CONTRAST_KEY, String(highContrast));
    }, [highContrast]);

    const setFontSize = (size: FontSize) => setFontSizeState(size);
    const toggleHighContrast = () => setHighContrastState((prev) => !prev);

    return (
        <AccessibilityContext.Provider
            value={{
                fontSize,
                highContrast,
                setFontSize,
                toggleHighContrast,
            }}
        >
            {children}
        </AccessibilityContext.Provider>
    );
};

export const useAccessibility = (): AccessibilityContextType => {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error('useAccessibility must be used within an AccessibilityProvider');
    }
    return context;
};

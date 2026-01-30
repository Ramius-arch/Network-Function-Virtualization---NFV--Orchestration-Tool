import React, { createContext, useState, useContext } from 'react';

type EnvironmentMode = 'live' | 'demo';

interface EnvironmentContextType {
    envMode: EnvironmentMode;
    setEnvMode: (mode: EnvironmentMode) => void;
    isDemo: boolean;
}

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined);

export const EnvironmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [envMode, setEnvModeState] = useState<EnvironmentMode>(
        (localStorage.getItem('atomic_env_mode') as EnvironmentMode) || 'demo'
    );

    const setEnvMode = (mode: EnvironmentMode) => {
        setEnvModeState(mode);
        localStorage.setItem('atomic_env_mode', mode);
    };

    const isDemo = envMode === 'demo';

    return (
        <EnvironmentContext.Provider value={{ envMode, setEnvMode, isDemo }}>
            {children}
        </EnvironmentContext.Provider>
    );
};

export const useEnvironment = () => {
    const context = useContext(EnvironmentContext);
    if (context === undefined) {
        throw new Error('useEnvironment must be used within an EnvironmentProvider');
    }
    return context;
};

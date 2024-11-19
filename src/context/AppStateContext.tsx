import React, { createContext, useContext, useState } from "react";

interface AppState {
    isNotificationsPageMode: boolean; 
    setIsNotificationsPageMode: (value: boolean) => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isNotificationsPageMode, setIsNotificationsPageMode] = useState(false);

    return (
        <AppStateContext.Provider
            value={{
                isNotificationsPageMode,
                setIsNotificationsPageMode,
            }}
        >
            {children}
        </AppStateContext.Provider>
    );
};

export const useAppState = (): AppState => {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error("useAppState must be used within an AppStateProvider");
    }
    return context;
};

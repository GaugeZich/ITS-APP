import React, { createContext, useContext, useState, PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';
import { theme } from './theme';

type ThemeMode = 'light' | 'dark';

type ThemeContextType = {
    mode: ThemeMode;
    colors: typeof theme.colors.light;
    isDark: boolean;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
    // Detecta el tema preferido del sistema operativo por defecto
    const systemScheme = useColorScheme();
    const [mode, setMode] = useState<ThemeMode>(systemScheme === 'dark' ? 'dark' : 'light');

    const toggleTheme = () => {
        setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const colors = theme.colors[mode];
    const isDark = mode === 'dark';

    return (
        <ThemeContext.Provider value={{ mode, colors, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme debe usarse dentro de un ThemeProvider');
    }
    return context;
}
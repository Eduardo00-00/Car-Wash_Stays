import { createContext, useContext, useState } from 'react';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: typeof lightColors;
}

const lightColors = {
  fondo: '#F5F7FA',
  fondoCard: '#ffffff',
  texto: '#0B1F33',
  textoSub: '#0B1F3388',
  header: '#0B1F33',
  textoHeader: '#F5F7FA',
  borde: '#C9A24D66',
  dorado: '#C9A24D',
  inputFondo: '#ffffff',
};

const darkColors = {
  fondo: '#0B1F33',
  fondoCard: '#162C42',
  texto: '#F5F7FA',
  textoSub: '#F5F7FA88',
  header: '#1C1C1C',
  textoHeader: '#F5F7FA',
  borde: '#C9A24D44',
  dorado: '#C9A24D',
  inputFondo: '#162C42',
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  colors: lightColors,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
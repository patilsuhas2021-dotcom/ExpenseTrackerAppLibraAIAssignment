import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user, syncThemePreference } = useContext(AuthContext);
  
  // Read initial theme preference (default to dark for modern appearance)
  const [theme, setTheme] = useState(() => {
    const localTheme = localStorage.getItem('theme');
    if (localTheme) return localTheme;
    return 'dark';
  });

  // Sync theme changes with HTML document element classes
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Sync theme with authenticated user's remote profile
  useEffect(() => {
    if (user?.themePreference && user.themePreference !== theme) {
      setTheme(user.themePreference);
    }
  }, [user]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (user) {
      syncThemePreference(nextTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

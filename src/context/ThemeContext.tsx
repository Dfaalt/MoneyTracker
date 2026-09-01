import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeAccent = 'emerald' | 'blue' | 'indigo' | 'amber';

export interface ThemeConfig {
  id: ThemeAccent;
  name: string;
  label: string;
  description: string;
  primaryColor: string;
  gradientFrom: string;
  gradientTo: string;
  bgGlow: string;
  badgeClass: string;
}

export const THEME_OPTIONS: ThemeConfig[] = [
  {
    id: 'emerald',
    name: 'Emerald Green',
    label: 'Hijau Zamrud',
    description: 'Fresh, lambang pertumbuhan aset & kekayaan',
    primaryColor: '#10b981',
    gradientFrom: '#10b981',
    gradientTo: '#14b8a6',
    bgGlow: 'rgba(16, 185, 129, 0.35)',
    badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  {
    id: 'blue',
    name: 'Ocean Sapphire',
    label: 'Biru Samudra',
    description: 'Elegan, lambang kepercayaan & perbankan digital',
    primaryColor: '#3b82f6',
    gradientFrom: '#3b82f6',
    gradientTo: '#06b6d4',
    bgGlow: 'rgba(59, 130, 246, 0.35)',
    badgeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  {
    id: 'indigo',
    name: 'Cyber Indigo',
    label: 'Ungu Indigo',
    description: 'Futuristik, modern & high-tech fintech vibes',
    primaryColor: '#6366f1',
    gradientFrom: '#6366f1',
    gradientTo: '#8b5cf6',
    bgGlow: 'rgba(99, 102, 241, 0.35)',
    badgeClass: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  },
  {
    id: 'amber',
    name: 'Sunset Amber',
    label: 'Emas Hangat',
    description: 'Mewah, hangat & premium gold luxury',
    primaryColor: '#f59e0b',
    gradientFrom: '#f59e0b',
    gradientTo: '#ea580c',
    bgGlow: 'rgba(245, 158, 11, 0.35)',
    badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
];

interface ThemeContextType {
  theme: ThemeAccent;
  setTheme: (theme: ThemeAccent) => void;
  currentTheme: ThemeConfig;
}

const THEME_STORAGE_KEY = 'money_tracker_theme_accent';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeAccent>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeAccent;
    if (saved && ['emerald', 'blue', 'indigo', 'amber'].includes(saved)) {
      return saved;
    }
    return 'emerald';
  });

  const setTheme = (newTheme: ThemeAccent) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const currentTheme = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

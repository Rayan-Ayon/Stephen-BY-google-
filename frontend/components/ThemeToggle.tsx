import React from 'react';
import { SunIcon, MoonIcon } from './icons';
import { Theme } from '../App';

interface ThemeToggleProps {
  theme: Theme;
  toggleTheme: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  toggleTheme,
  className = '',
}) => {
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-xl transition-all cursor-pointer ${
        theme === 'dark'
          ? 'text-neutral-400 hover:text-white hover:bg-[#15181E] border border-transparent hover:border-[#222732]'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-sm'
      } ${className}`}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label="Toggle color theme"
    >
      {theme === 'dark' ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
    </button>
  );
};

export default ThemeToggle;

import React from 'react';
import { UsersIcon } from './icons/UsersIcon';
import { ThemeToggle } from './ThemeToggle';
import { TicketIcon } from './icons/TicketIcon';

interface HeaderProps {
  onToggleDirectory: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleDirectory, theme, setTheme }) => {
  return (
    <header className="bg-surface dark:bg-dark-surface/80 border-b border-border-primary dark:border-dark-border-primary shadow-md sticky top-0 z-30 backdrop-blur-lg">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
            {/* Left Side: App Title & Tagline */}
            <div className="flex items-center gap-3">
              <TicketIcon className="w-10 h-10 text-oracle-red" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-content-primary dark:text-dark-content-primary">
                  Accordance
                </h1>
                <p className="text-sm uppercase tracking-wider text-content-secondary dark:text-dark-content-secondary">
                  TOP NOTCH MANAGEMENT
                </p>
              </div>
            </div>

            {/* Right Side: Action Buttons */}
            <div className="flex items-center gap-2">
              <ThemeToggle theme={theme} setTheme={setTheme} />
              <button 
                onClick={onToggleDirectory} 
                className="flex items-center gap-2 px-4 py-2 bg-surface dark:bg-dark-surface border border-border-primary dark:border-dark-border-secondary text-content-secondary dark:text-dark-content-secondary hover:text-content-primary dark:hover:text-dark-content-primary hover:bg-slate-50 dark:hover:bg-dark-border-primary rounded-md shadow-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-oracle-red/50" 
                aria-label="Toggle employee directory"
              >
                <UsersIcon className="w-5 h-5" />
                <span className="font-medium text-sm hidden sm:inline">Employee Directory</span>
              </button>
            </div>
        </div>
      </div>
    </header>
  );
};
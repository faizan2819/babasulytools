
import React from 'react';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <header className="py-6 px-4 mb-8 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg">
            <i className="fa-solid fa-user-pen text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Humanize<span className="text-indigo-600">AI</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Make your AI content sound real</p>
          </div>
        </div>

        <button 
          onClick={toggleDarkMode}
          className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <i className="fa-solid fa-sun text-lg"></i> : <i className="fa-solid fa-moon text-lg"></i>}
        </button>
      </div>
    </header>
  );
};


import React, { useRef } from 'react';

interface EditorProps {
  label: string;
  value: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  isLoading?: boolean;
  wordCount: number;
  showDiff?: boolean;
  onToggleDiff?: () => void;
  children?: React.ReactNode;
}

export const Editor: React.FC<EditorProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  readOnly = false, 
  isLoading = false,
  wordCount,
  showDiff = false,
  onToggleDiff,
  children
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value);
    }
  };

  const handleClear = () => {
    if (onChange) onChange('');
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-300 overflow-hidden">
      <div className="flex justify-between items-center px-5 py-3 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</span>
          {readOnly && value && (
            <button 
              onClick={onToggleDiff}
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border transition-all ${
                showDiff 
                ? 'bg-indigo-600 border-indigo-600 text-white' 
                : 'bg-transparent border-slate-300 dark:border-slate-600 text-slate-500 hover:border-indigo-500'
              }`}
            >
              Highlight Changes
            </button>
          )}
        </div>
        <div className="flex items-center space-x-3">
          {!readOnly && value && (
            <button 
              onClick={handleClear}
              className="text-slate-400 hover:text-red-500 transition-colors text-xs font-semibold"
            >
              <i className="fa-solid fa-trash-can mr-1"></i> Clear
            </button>
          )}
          {readOnly && value && (
            <button 
              onClick={handleCopy}
              className="group text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors flex items-center space-x-1 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-xs font-bold"
            >
              <i className="fa-regular fa-copy group-active:scale-110 transition-transform"></i>
              <span>Copy</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="relative flex-grow min-h-[400px]">
        {isLoading && (
          <div className="absolute inset-0 z-20 bg-white/80 dark:bg-slate-800/80 flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <div className="relative">
                 <div className="w-12 h-12 border-4 border-indigo-100 dark:border-slate-700 rounded-full"></div>
                 <div className="absolute top-0 w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="mt-6 text-slate-900 dark:text-white font-bold text-sm tracking-wide animate-pulse">REFINING YOUR CONTENT...</p>
              <p className="mt-1 text-slate-500 dark:text-slate-400 text-xs italic font-medium">Injecting personality & flow</p>
            </div>
          </div>
        )}

        {showDiff ? (
           children
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            placeholder={placeholder}
            readOnly={readOnly}
            className={`w-full h-full p-6 text-slate-800 dark:text-slate-200 bg-transparent resize-none focus:outline-none leading-relaxed text-base transition-opacity duration-300 ${isLoading ? 'opacity-20' : 'opacity-100'}`}
          />
        )}
      </div>

      <div className="px-5 py-3 bg-slate-50/50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
            Word Count: <span className="text-indigo-600 dark:text-indigo-400 ml-1">{wordCount}</span>
          </span>
          {label === 'Output' && wordCount > 0 && (
             <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">
               Ready to publish
             </span>
          )}
        </div>
        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
      </div>
    </div>
  );
};


import React from 'react';

interface DiffViewerProps {
  oldText: string;
  newText: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ oldText, newText }) => {
  // Simple word-level diffing logic
  const diffWords = (oldStr: string, newStr: string) => {
    const oldWords = oldStr.split(/(\s+)/);
    const newWords = newStr.split(/(\s+)/);
    
    // Using a simple comparison for demonstration. 
    // In a production app, a library like 'diff' would be used.
    // Here we just map the new words and highlight those not in the old.
    const oldSet = new Set(oldStr.toLowerCase().split(/\W+/));
    
    return newWords.map((word, i) => {
      const cleanWord = word.trim().toLowerCase().replace(/\W/g, '');
      if (cleanWord && !oldSet.has(cleanWord)) {
        return (
          <span key={i} className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 px-0.5 rounded transition-colors">
            {word}
          </span>
        );
      }
      return <span key={i}>{word}</span>;
    });
  };

  return (
    <div className="w-full h-full p-5 text-slate-800 dark:text-slate-200 overflow-y-auto leading-relaxed text-base bg-slate-50/50 dark:bg-slate-900/30 whitespace-pre-wrap">
      {diffWords(oldText, newText)}
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Editor } from './components/Editor';
import { DiffViewer } from './components/DiffViewer';
import { Tone, Readability, ProcessingOptions } from './types';
import { humanizeContent } from './services/geminiService';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [options, setOptions] = useState<ProcessingOptions>({
    tone: Tone.FRIENDLY,
    readability: Readability.MEDIUM
  });

  const [wordCounts, setWordCounts] = useState({
    input: 0,
    output: 0
  });

  useEffect(() => {
    // Sync with system theme on mount
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const count = inputText.trim() === '' ? 0 : inputText.trim().split(/\s+/).length;
    setWordCounts(prev => ({ ...prev, input: count }));
    // Reset output when input is cleared
    if (inputText.trim() === '') {
      setOutputText('');
      setShowDiff(false);
    }
  }, [inputText]);

  useEffect(() => {
    const count = outputText.trim() === '' ? 0 : outputText.trim().split(/\s+/).length;
    setWordCounts(prev => ({ ...prev, output: count }));
  }, [outputText]);

  const handleHumanize = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setShowDiff(false); // Reset diff view on new request
    try {
      const result = await humanizeContent(inputText, options);
      setOutputText(result);
    } catch (error) {
      console.error(error);
      // Fallback message
      setOutputText("Unable to process request. Please check your network or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionChange = (key: keyof ProcessingOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-500 pb-20 selection:bg-indigo-100 dark:selection:bg-indigo-900">
      <Header isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tool Description */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Content Refiner <span className="text-indigo-600 italic">2.0</span>
          </h2>
          <p className="mt-3 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Advanced linguistic engine designed to strip away AI patterns and inject authentic human warmth, flow, and nuance into your drafts.
          </p>
        </div>

        {/* Controls Section */}
        <section className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 mb-10 transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-end">
            
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                <i className="fa-solid fa-microphone-lines text-indigo-500"></i>
                <span>Desired Voice Tone</span>
              </label>
              <div className="relative group">
                <select 
                  value={options.tone}
                  onChange={(e) => handleOptionChange('tone', e.target.value)}
                  className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl px-5 py-4 focus:border-indigo-500 focus:ring-0 transition-all outline-none cursor-pointer font-semibold"
                >
                  {Object.values(Tone).map(tone => (
                    <option key={tone} value={tone}>{tone}</option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
                  <i className="fa-solid fa-angle-down"></i>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                <i className="fa-solid fa-book-open text-indigo-500"></i>
                <span>Readability Level</span>
              </label>
              <div className="relative group">
                <select 
                  value={options.readability}
                  onChange={(e) => handleOptionChange('readability', e.target.value)}
                  className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl px-5 py-4 focus:border-indigo-500 focus:ring-0 transition-all outline-none cursor-pointer font-semibold"
                >
                  {Object.values(Readability).map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
                  <i className="fa-solid fa-angle-down"></i>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <button 
                onClick={handleHumanize}
                disabled={isLoading || !inputText.trim()}
                className="w-full group bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 dark:disabled:text-slate-500 text-white font-black py-4 px-8 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all duration-300 transform active:scale-[0.97] flex items-center justify-center space-x-3 overflow-hidden"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                    </div>
                    <span>REFINING TEXT</span>
                  </div>
                ) : (
                  <>
                    <i className="fa-solid fa-sparkles text-lg group-hover:rotate-12 transition-transform"></i>
                    <span className="tracking-widest uppercase">Humanize content</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Main Workspace */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="h-full">
            <Editor 
              label="Input Content"
              value={inputText}
              onChange={setInputText}
              placeholder="Paste AI-generated text or drafts that feel too robotic..."
              wordCount={wordCounts.input}
            />
          </div>
          <div className="h-full">
            <Editor 
              label="Refined Output"
              value={outputText}
              readOnly={true}
              isLoading={isLoading}
              placeholder="Your natural, engaging content will appear here after processing..."
              wordCount={wordCounts.output}
              showDiff={showDiff}
              onToggleDiff={() => setShowDiff(!showDiff)}
            >
              <DiffViewer oldText={inputText} newText={outputText} />
            </Editor>
          </div>
        </section>

        {/* Features List */}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 rounded-3xl bg-indigo-600/10 dark:bg-indigo-400/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-2xl mb-6">
                <i className="fa-solid fa-brain-circuit"></i>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Linguistic Logic</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                Goes beyond synonyms. We rewrite sentence structures to mimic the rhythmic variety found in natural human speech.
              </p>
           </div>

           <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 rounded-3xl bg-rose-600/10 dark:bg-rose-400/10 flex items-center justify-center text-rose-600 dark:text-rose-400 text-2xl mb-6">
                <i className="fa-solid fa-feather-pointed"></i>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Style & Soul</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                Injects personality and nuance while maintaining the professional integrity and original core meaning of your text.
              </p>
           </div>

           <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-600/10 dark:bg-emerald-400/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-2xl mb-6">
                <i className="fa-solid fa-ghost"></i>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Ghost Mode</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                Reduces 'perplexed' AI signatures. The result is content that feels organic, authentic, and truly yours.
              </p>
           </div>
        </section>
      </main>

      <footer className="mt-24 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-slate-400 dark:text-slate-600 text-[11px] font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} HumanizeAI Studio &bull; Made with Gemini
          </p>
          <div className="flex space-x-6 text-slate-400 dark:text-slate-600">
             <a href="#" className="hover:text-indigo-500 transition-colors"><i className="fa-brands fa-github text-lg"></i></a>
             <a href="#" className="hover:text-indigo-500 transition-colors"><i className="fa-brands fa-twitter text-lg"></i></a>
             <a href="#" className="hover:text-indigo-500 transition-colors"><i className="fa-solid fa-envelope text-lg"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

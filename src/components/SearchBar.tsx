import React, { useState } from 'react';
import { Search, Loader2, Clock, X } from 'lucide-react';
import type { HistoryEntry } from '../types/certificate';

interface SearchBarProps {
  onSearch: (domain: string) => void;
  isLoading: boolean;
  history: HistoryEntry[];
  onClearHistory: () => void;
  darkMode: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading, history, onClearHistory, darkMode }) => {
  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
      setShowHistory(false);
    }
  };

  const handleHistoryClick = (domain: string) => {
    setInput(domain);
    onSearch(domain);
    setShowHistory(false);
  };

  const statusDot = (grade: string) => {
    if (grade === 'A' || grade === 'B') return 'bg-emerald-400';
    if (grade === 'C') return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className={`flex gap-2 p-2 rounded-2xl border shadow-lg transition-all ${darkMode
          ? 'bg-slate-800/80 border-slate-600/60 shadow-black/20'
          : 'bg-white border-slate-200 shadow-slate-200/60'}`}>
          <div className="relative flex-1">
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onFocus={() => setShowHistory(true)}
              onBlur={() => setTimeout(() => setShowHistory(false), 150)}
              placeholder="example.com or https://example.com"
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium outline-none transition-all placeholder:font-normal ${darkMode
                ? 'bg-slate-700/50 text-white placeholder:text-slate-500 focus:bg-slate-700'
                : 'bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white'}`}
              disabled={isLoading}
              autoComplete="off"
              spellCheck={false}
            />
            {input && (
              <button
                type="button"
                onClick={() => setInput('')}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full ${darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-95 whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Scanning...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>INSPECT</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* History Dropdown */}
      {showHistory && history.length > 0 && (
        <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-xl z-50 overflow-hidden ${darkMode
          ? 'bg-slate-800 border-slate-700 shadow-black/30'
          : 'bg-white border-slate-200 shadow-slate-200/80'}`}>
          <div className={`flex items-center justify-between px-4 py-2.5 border-b ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
            <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <Clock className="w-3 h-3" />
              Recent Checks
            </div>
            <button
              onClick={onClearHistory}
              className={`text-xs ${darkMode ? 'text-slate-500 hover:text-red-400' : 'text-slate-400 hover:text-red-500'} transition-colors`}
            >
              Clear
            </button>
          </div>
          {history.slice(0, 5).map((entry, i) => (
            <button
              key={i}
              onMouseDown={() => handleHistoryClick(entry.domain)}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${darkMode
                ? 'hover:bg-slate-700/60 text-slate-300'
                : 'hover:bg-slate-50 text-slate-700'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${statusDot(entry.grade)}`} />
                <span className="text-sm font-medium">{entry.domain}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  entry.grade === 'A' ? 'bg-emerald-500/20 text-emerald-400' :
                  entry.grade === 'B' ? 'bg-green-500/20 text-green-400' :
                  entry.grade === 'C' ? 'bg-yellow-500/20 text-yellow-400' :
                  entry.grade === 'D' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-red-500/20 text-red-400'
                }`}>Grade {entry.grade}</span>
                <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {new Date(entry.checkedAt).toLocaleDateString()}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Tips */}
      <div className={`flex flex-wrap gap-x-4 gap-y-1 mt-3 px-1 text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
        <span>Try: <button className="underline underline-offset-2 hover:text-cyan-500 transition-colors" onMouseDown={() => { setInput('google.com'); onSearch('google.com'); }}>google.com</button></span>
        <span><button className="underline underline-offset-2 hover:text-cyan-500 transition-colors" onMouseDown={() => { setInput('github.com'); onSearch('github.com'); }}>github.com</button></span>
        <span><button className="underline underline-offset-2 hover:text-cyan-500 transition-colors" onMouseDown={() => { setInput('expired.example.com'); onSearch('expired.example.com'); }}>expired.example.com</button></span>
        <span><button className="underline underline-offset-2 hover:text-cyan-500 transition-colors" onMouseDown={() => { setInput('selfSign.test.com'); onSearch('selfSign.test.com'); }}>selfSign.test.com</button></span>
      </div>
    </div>
  );
};

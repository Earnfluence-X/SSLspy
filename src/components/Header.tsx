import React from 'react';
import { Shield, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDark: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, onToggleDark }) => {
  return (
    <header className={`border-b ${darkMode ? 'bg-slate-900 border-slate-700/60' : 'bg-white border-slate-200'} sticky top-0 z-40 backdrop-blur-sm`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                SSL<span className="text-cyan-500">Spy</span>
              </h1>
              <span className={`text-xs px-1.5 py-0.5 rounded font-mono font-medium ${darkMode ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20' : 'bg-cyan-50 text-cyan-600 border border-cyan-200'}`}>
                v2.0
              </span>
            </div>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              SSL/TLS Certificate Inspector
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://letsencrypt.org/"
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            <span>🔐</span>
            <span>About SSL</span>
          </a>
          <button
            onClick={onToggleDark}
            className={`p-2 rounded-lg transition-all ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700 border border-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'}`}
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  domain: string;
  onRetry: () => void;
  darkMode: boolean;
}

const ERROR_SUGGESTIONS: Record<string, string> = {
  'valid domain': 'Make sure to enter a domain like example.com or https://example.com',
  'connection': 'Check your internet connection and try again',
  'timeout': 'The server took too long to respond. Try again later.',
  'rate': 'Too many requests. Please wait a moment before trying again.',
  'not found': 'This domain may not have an SSL certificate or may not exist.',
};

export const ErrorState: React.FC<ErrorStateProps> = ({ error, domain, onRetry, darkMode }) => {
  const suggestion = Object.entries(ERROR_SUGGESTIONS).find(([key]) =>
    error.toLowerCase().includes(key)
  )?.[1] ?? 'Please verify the domain and try again.';

  return (
    <div className={`rounded-2xl border p-8 ${darkMode ? 'bg-slate-800/60 border-red-500/20' : 'bg-white border-red-200'}`}>
      <div className="flex flex-col items-center text-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>

        <div>
          <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Inspection Failed
          </h3>
          {domain && (
            <p className={`text-sm font-mono mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{domain}</p>
          )}
        </div>

        <div className={`px-5 py-4 rounded-xl border max-w-sm ${darkMode ? 'bg-red-500/5 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-700'}`}>
          <p className="text-sm font-medium">{error}</p>
          <p className={`text-xs mt-2 ${darkMode ? 'text-red-400/70' : 'text-red-500'}`}>{suggestion}</p>
        </div>

        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );
};

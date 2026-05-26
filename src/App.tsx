import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CertSummary } from './components/CertSummary';
import { SecurityDetails } from './components/SecurityDetails';
import { SecurityScore } from './components/SecurityScore';
import { PemViewer } from './components/PemViewer';
import { EducationalPanel } from './components/EducationalPanel';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { WelcomeState } from './components/WelcomeState';
import { fetchCertificate } from './utils/certificateSimulator';
import type { CertificateData, HistoryEntry } from './types/certificate';

type AppState = 'idle' | 'loading' | 'success' | 'error';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem('sslspy-dark');
    if (stored !== null) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [appState, setAppState] = useState<AppState>('idle');
  const [currentDomain, setCurrentDomain] = useState('');
  const [certData, setCertData] = useState<CertificateData | null>(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('sslspy-history') ?? '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('sslspy-dark', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('sslspy-history', JSON.stringify(history));
  }, [history]);

  const handleSearch = useCallback(async (domain: string) => {
    setCurrentDomain(domain);
    setAppState('loading');
    setError('');
    setCertData(null);

    try {
      const cert = await fetchCertificate(domain);
      setCertData(cert);
      setAppState('success');

      // Update history
      setHistory(prev => {
        const filtered = prev.filter(h => h.domain !== cert.domain);
        const entry: HistoryEntry = {
          domain: cert.domain,
          checkedAt: new Date().toISOString(),
          status: cert.status,
          grade: cert.grade,
        };
        return [entry, ...filtered].slice(0, 10);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setAppState('error');
    }
  }, []);

  const handleRetry = () => {
    if (currentDomain) {
      handleSearch(currentDomain);
    } else {
      setAppState('idle');
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('sslspy-history');
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <Header darkMode={darkMode} onToggleDark={() => setDarkMode(d => !d)} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Search */}
        <div className="mb-8">
          <SearchBar
            onSearch={handleSearch}
            isLoading={appState === 'loading'}
            history={history}
            onClearHistory={handleClearHistory}
            darkMode={darkMode}
          />
        </div>

        {/* States */}
        {appState === 'idle' && (
          <WelcomeState darkMode={darkMode} onSearch={handleSearch} />
        )}

        {appState === 'loading' && (
          <LoadingState domain={currentDomain} darkMode={darkMode} />
        )}

        {appState === 'error' && (
          <ErrorState error={error} domain={currentDomain} onRetry={handleRetry} darkMode={darkMode} />
        )}

        {appState === 'success' && certData && (
          <div className="space-y-5">
            {/* Domain Banner */}
            <div className={`flex items-center justify-between px-4 py-3 rounded-xl border ${
              darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className={`text-sm font-mono ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  https://<span className="font-bold">{certData.domain}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {certData.isWildcard && (
                  <span className={`text-xs px-2 py-0.5 rounded-lg border font-medium ${darkMode ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-yellow-50 text-yellow-600 border-yellow-200'}`}>
                    Wildcard
                  </span>
                )}
                {certData.isSelfSigned && (
                  <span className={`text-xs px-2 py-0.5 rounded-lg border font-medium ${darkMode ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>
                    Self-Signed
                  </span>
                )}
                <span className={`text-xs px-2 py-0.5 rounded-lg border font-bold ${
                  certData.grade === 'A' ? (darkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200') :
                  certData.grade === 'B' ? (darkMode ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-600 border-green-200') :
                  certData.grade === 'C' ? (darkMode ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-yellow-50 text-yellow-600 border-yellow-200') :
                  (darkMode ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-200')
                }`}>
                  Grade {certData.grade} · {certData.score}/100
                </span>
              </div>
            </div>

            <CertSummary cert={certData} darkMode={darkMode} />
            <SecurityDetails cert={certData} darkMode={darkMode} />
            <SecurityScore cert={certData} darkMode={darkMode} />
            <PemViewer cert={certData} darkMode={darkMode} />
            <EducationalPanel darkMode={darkMode} />
          </div>
        )}

        {/* Educational panel always shown in idle */}
        {appState === 'idle' && (
          <div className="mt-5">
            <EducationalPanel darkMode={darkMode} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`mt-16 border-t py-8 ${darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white/50'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              SSL<span className="text-cyan-500">Spy</span>
            </span>
            <span className={`text-xs ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>·</span>
            <span className={`text-xs ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>SSL/TLS Certificate Inspector</span>
          </div>
          <div className={`flex items-center gap-4 text-xs ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
            <span>Results are simulated for educational purposes</span>
            <span>·</span>
            <a href="https://letsencrypt.org/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-500 transition-colors">
              Get Free SSL →
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React from 'react';
import { Shield, Search, Star, AlertTriangle, Info } from 'lucide-react';

interface WelcomeStateProps {
  darkMode: boolean;
  onSearch: (domain: string) => void;
}

const FEATURES = [
  { icon: '🔍', title: 'Certificate Analysis', desc: 'Inspect validity, issuer, and expiration' },
  { icon: '🛡️', title: 'Security Scoring', desc: 'Grade A–F based on key size, TLS, and more' },
  { icon: '📋', title: 'PEM Viewer', desc: 'View, copy, and download certificates' },
  { icon: '📚', title: 'Educational', desc: 'Learn what each metric means' },
];

const EXAMPLES = [
  { domain: 'google.com', label: 'Google', grade: 'A', status: 'Valid' },
  { domain: 'github.com', label: 'GitHub', grade: 'A', status: 'Valid' },
  { domain: 'cloudflare.com', label: 'Cloudflare', grade: 'A', status: 'Valid' },
  { domain: 'example.com', label: 'Example.com', grade: 'A', status: 'Valid' },
  { domain: 'expired.test.com', label: 'Expired Cert', grade: 'F', status: 'Expired' },
  { domain: 'selfSign.test.com', label: 'Self-Signed', grade: 'F', status: 'Self-Signed' },
];

const gradeColor = (g: string) => {
  if (g === 'A') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  if (g === 'B') return 'text-green-400 bg-green-500/10 border-green-500/20';
  return 'text-red-400 bg-red-500/10 border-red-500/20';
};

export const WelcomeState: React.FC<WelcomeStateProps> = ({ darkMode, onSearch }) => {
  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200'}`}>
        <div className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-transparent" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/4" />

          <div className="relative p-8 sm:p-10">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/20 shrink-0">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Welcome to <span className="text-cyan-500">SSLSpy</span>
                </h2>
                <p className={`mt-2 text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Inspect SSL/TLS certificates, analyze security configurations, and get letter grades 
                  for any website. Enter a domain above to get started.
                </p>
              </div>
            </div>

            {/* Feature grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
              {FEATURES.map((f, i) => (
                <div key={i} className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-900/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{f.title}</div>
                  <div className={`text-xs mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Examples */}
      <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200'}`}>
        <div className={`px-5 py-3.5 border-b flex items-center gap-2 ${darkMode ? 'border-slate-700/60' : 'border-slate-100'}`}>
          <Search className="w-4 h-4 text-cyan-500" />
          <h2 className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Try These Examples
          </h2>
        </div>
        <div className="p-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => onSearch(ex.domain)}
              className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
                darkMode
                  ? 'bg-slate-900/50 border-slate-700/50 hover:border-cyan-500/30 hover:bg-slate-900/80'
                  : 'bg-slate-50 border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/30'
              }`}
            >
              <div>
                <div className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{ex.label}</div>
                <div className={`text-xs font-mono mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{ex.domain}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${gradeColor(ex.grade)}`}>
                  Grade {ex.grade}
                </span>
                <span className={`text-xs ${ex.status === 'Valid' ? 'text-emerald-400' : 'text-red-400'}`}>{ex.status}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className={`rounded-2xl border p-5 ${darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200'}`}>
        <div className={`flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          <Info className="w-4 h-4 text-cyan-500" />
          How It Works
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          {[
            { step: '1', label: 'Enter Domain', desc: 'Type any domain or URL into the search bar' },
            { step: '2', label: 'Analyze', desc: 'SSLSpy fetches and analyzes the certificate' },
            { step: '3', label: 'Get Results', desc: 'Review security score, details, and the PEM' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 flex-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                {item.step}
              </div>
              <div>
                <div className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{item.label}</div>
                <div className={`text-xs mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{item.desc}</div>
              </div>
              {i < 2 && <div className={`hidden sm:block self-center text-xl ${darkMode ? 'text-slate-700' : 'text-slate-200'}`}>→</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Scoring info */}
      <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200'}`}>
        <div className={`px-5 py-3.5 border-b flex items-center gap-2 ${darkMode ? 'border-slate-700/60' : 'border-slate-100'}`}>
          <Star className="w-4 h-4 text-cyan-500" />
          <h2 className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Security Grade Scale
          </h2>
        </div>
        <div className="p-5 grid grid-cols-5 gap-2">
          {[
            { grade: 'A', range: '90–100', label: 'Excellent', color: 'from-emerald-400 to-green-500' },
            { grade: 'B', range: '80–89', label: 'Good', color: 'from-green-400 to-teal-500' },
            { grade: 'C', range: '70–79', label: 'Fair', color: 'from-yellow-400 to-amber-500' },
            { grade: 'D', range: '60–69', label: 'Poor', color: 'from-orange-400 to-red-400' },
            { grade: 'F', range: '<60', label: 'Critical', color: 'from-red-500 to-rose-600' },
          ].map((g, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center shadow-lg`}>
                <span className="text-white text-xl font-black">{g.grade}</span>
              </div>
              <div className="text-center">
                <div className={`text-xs font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{g.label}</div>
                <div className={`text-xs font-mono ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{g.range}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Tips */}
      <div className={`rounded-xl border p-4 flex items-start gap-3 ${darkMode ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <div>
          <div className={`text-xs font-bold uppercase tracking-wide ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>Security Reminder</div>
          <p className={`text-xs mt-1 leading-relaxed ${darkMode ? 'text-amber-400/70' : 'text-amber-600'}`}>
            Always verify certificates before entering sensitive information. Check the padlock icon in your browser address bar — a valid SSL certificate doesn't guarantee a site is safe, but no certificate is always a red flag.
          </p>
        </div>
      </div>
    </div>
  );
};

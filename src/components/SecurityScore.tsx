import React from 'react';
import { Trophy, TrendingUp } from 'lucide-react';
import type { CertificateData } from '../types/certificate';

interface SecurityScoreProps {
  cert: CertificateData;
  darkMode: boolean;
}

const gradeConfig = {
  A: { color: 'from-emerald-400 to-green-500', glow: 'shadow-emerald-500/30', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Excellent Configuration' },
  B: { color: 'from-green-400 to-teal-500', glow: 'shadow-green-500/30', text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', label: 'Good Configuration' },
  C: { color: 'from-yellow-400 to-amber-500', glow: 'shadow-yellow-500/30', text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Fair Configuration' },
  D: { color: 'from-orange-400 to-red-400', glow: 'shadow-orange-500/30', text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'Poor Configuration' },
  F: { color: 'from-red-400 to-rose-600', glow: 'shadow-red-500/30', text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Critical Issues' },
};

export const SecurityScore: React.FC<SecurityScoreProps> = ({ cert, darkMode }) => {
  const cfg = gradeConfig[cert.grade as keyof typeof gradeConfig] ?? gradeConfig['F'];
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (cert.score / 100) * circumference;

  return (
    <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200'}`}>
      <div className={`px-5 py-3.5 border-b flex items-center gap-2 ${darkMode ? 'border-slate-700/60' : 'border-slate-100'}`}>
        <Trophy className="w-4 h-4 text-cyan-500" />
        <h2 className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          Security Score
        </h2>
      </div>

      <div className="p-5">
        {/* Score Banner */}
        <div className={`p-5 rounded-2xl border mb-5 ${cfg.bg} ${cfg.border}`}>
          <div className="flex items-center gap-6">
            {/* Circular Progress */}
            <div className="relative w-32 h-32 shrink-0">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke="url(#scoreGrad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={cert.grade === 'A' ? '#34d399' : cert.grade === 'B' ? '#4ade80' : cert.grade === 'C' ? '#facc15' : cert.grade === 'D' ? '#fb923c' : '#f87171'} />
                    <stop offset="100%" stopColor={cert.grade === 'A' ? '#22c55e' : cert.grade === 'B' ? '#14b8a6' : cert.grade === 'C' ? '#f59e0b' : cert.grade === 'D' ? '#ef4444' : '#e11d48'} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-black ${cfg.text}`}>{cert.grade}</span>
                <span className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{cert.score}/100</span>
              </div>
            </div>

            <div className="flex-1">
              <div className={`text-lg font-bold ${cfg.text}`}>{cfg.label}</div>
              <div className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Security score based on certificate configuration, key strength, and protocol support.
              </div>

              {/* Score Bar */}
              <div className="mt-4">
                <div className={`flex justify-between text-xs mb-1.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  <span>Score</span>
                  <span className={`font-bold ${cfg.text}`}>{cert.score} / 100</span>
                </div>
                <div className={`h-2.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${cfg.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${cert.score}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-2">
          <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            <TrendingUp className="w-3.5 h-3.5" />
            Score Breakdown
          </div>
          {cert.scoreBreakdown.map((item, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${darkMode ? 'bg-slate-900/40' : 'bg-slate-50'}`}>
              <div className={`text-base leading-none mt-0.5 ${item.positive ? '' : ''}`}>
                {item.positive ? '✅' : item.points <= -30 ? '❌' : '⚠️'}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{item.label}</div>
                <div className={`text-xs mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{item.description}</div>
              </div>
              <div className={`text-sm font-bold shrink-0 ${item.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                {item.positive ? '+' : ''}{item.points}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

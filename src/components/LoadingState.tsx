import React from 'react';
import { Shield } from 'lucide-react';

interface LoadingStateProps {
  domain: string;
  darkMode: boolean;
}

const steps = [
  { label: 'Resolving domain', delay: 0 },
  { label: 'Connecting to server', delay: 300 },
  { label: 'Fetching certificate chain', delay: 600 },
  { label: 'Analyzing security configuration', delay: 900 },
  { label: 'Calculating security score', delay: 1200 },
];

export const LoadingState: React.FC<LoadingStateProps> = ({ domain, darkMode }) => {
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    const timers = steps.map((s, i) =>
      setTimeout(() => setStep(i), s.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={`rounded-2xl border p-8 ${darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200'}`}>
      <div className="flex flex-col items-center text-center gap-6">
        {/* Animated Shield */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 animate-pulse">
            <Shield className="w-10 h-10 text-white" />
          </div>
          {/* Ripple rings */}
          <div className="absolute inset-0 rounded-2xl bg-cyan-500/20 animate-ping" />
        </div>

        <div>
          <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Inspecting Certificate
          </h3>
          <p className={`text-sm mt-1 font-mono ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
            {domain}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="w-full max-w-xs space-y-2">
          {steps.map((s, i) => (
            <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-300 ${i <= step ? '' : 'opacity-30'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                i < step ? 'bg-emerald-500' : i === step ? 'bg-cyan-500 animate-pulse' : (darkMode ? 'bg-slate-700' : 'bg-slate-200')
              }`}>
                {i < step ? (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <span className={`${i <= step ? (darkMode ? 'text-slate-200' : 'text-slate-700') : (darkMode ? 'text-slate-600' : 'text-slate-400')}`}>
                {s.label}
              </span>
              {i === step && (
                <span className="text-xs text-cyan-500 animate-pulse ml-auto">...</span>
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className={`w-full max-w-xs h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

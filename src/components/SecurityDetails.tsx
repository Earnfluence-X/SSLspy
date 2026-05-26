import React from 'react';
import { Key, Hash, Shuffle, Lock, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import type { CertificateData } from '../types/certificate';

interface SecurityDetailsProps {
  cert: CertificateData;
  darkMode: boolean;
}

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  status: 'good' | 'warn' | 'bad' | 'info';
  note?: string;
  darkMode: boolean;
}

const statusStyles = {
  good: { badge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20', icon: '✅' },
  warn: { badge: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20', icon: '⚠️' },
  bad: { badge: 'bg-red-500/15 text-red-400 border border-red-500/20', icon: '❌' },
  info: { badge: 'bg-blue-500/15 text-blue-400 border border-blue-500/20', icon: 'ℹ️' },
};

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value, status, note, darkMode }) => {
  const style = statusStyles[status];
  return (
    <div className={`flex items-center gap-4 p-3.5 rounded-xl ${darkMode ? 'bg-slate-900/40 hover:bg-slate-900/60' : 'bg-slate-50 hover:bg-slate-100/80'} transition-colors`}>
      <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white border border-slate-200'} ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{label}</div>
        <div className={`text-sm font-medium mt-0.5 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{value}</div>
        {note && <div className={`text-xs mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{note}</div>}
      </div>
      <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap ${style.badge}`}>
        <span>{style.icon}</span>
        <span>{status === 'good' ? (label.includes('TLS') ? 'Best' : 'Secure') : status === 'warn' ? 'Warning' : status === 'bad' ? 'Insecure' : 'Info'}</span>
      </div>
    </div>
  );
};

export const SecurityDetails: React.FC<SecurityDetailsProps> = ({ cert, darkMode }) => {
  const [showAllSans, setShowAllSans] = React.useState(false);

  const keyStatus = (): 'good' | 'warn' | 'bad' => {
    if (cert.publicKey.algorithm === 'EC') {
      return cert.publicKey.keySize >= 256 ? 'good' : 'bad';
    }
    if (cert.publicKey.keySize >= 2048) return 'good';
    return 'bad';
  };

  const sigStatus = (): 'good' | 'warn' | 'bad' => {
    if (cert.signatureAlgorithm.includes('SHA-1') || cert.signatureAlgorithm.toLowerCase().includes('sha1')) return 'bad';
    if (cert.signatureAlgorithm.includes('SHA-384') || cert.signatureAlgorithm.includes('SHA-512')) return 'good';
    return 'good';
  };

  const tlsStatus = (): 'good' | 'warn' | 'bad' => {
    if (cert.tlsVersion === 'TLS 1.3') return 'good';
    if (cert.tlsVersion === 'TLS 1.2') return 'warn';
    return 'bad';
  };

  const keyLabel = cert.publicKey.algorithm === 'EC'
    ? `${cert.publicKey.algorithm} ${cert.publicKey.keySize}-bit${cert.publicKey.curve ? ` (${cert.publicKey.curve})` : ''}`
    : `${cert.publicKey.algorithm} ${cert.publicKey.keySize} bits`;

  const visibleSans = showAllSans ? cert.san : cert.san.slice(0, 4);

  return (
    <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200'}`}>
      <div className={`px-5 py-3.5 border-b flex items-center gap-2 ${darkMode ? 'border-slate-700/60' : 'border-slate-100'}`}>
        <Lock className="w-4 h-4 text-cyan-500" />
        <h2 className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          Security Details
        </h2>
      </div>

      <div className="p-5 space-y-3">
        <DetailRow
          icon={<Key className="w-4 h-4" />}
          label="Public Key"
          value={keyLabel}
          status={keyStatus()}
          note={cert.publicKey.algorithm === 'RSA' ? (cert.publicKey.keySize < 2048 ? 'RSA keys should be at least 2048 bits' : 'RSA 2048-bit minimum recommended') : 'Elliptic curve cryptography is efficient and secure'}
          darkMode={darkMode}
        />
        <DetailRow
          icon={<Hash className="w-4 h-4" />}
          label="Signature Algorithm"
          value={cert.signatureAlgorithm}
          status={sigStatus()}
          note={cert.signatureAlgorithm.includes('SHA-1') ? 'SHA-1 is cryptographically broken — do not trust' : 'Modern hashing algorithm'}
          darkMode={darkMode}
        />
        <DetailRow
          icon={<Shuffle className="w-4 h-4" />}
          label="Key Exchange"
          value={cert.forwardSecrecy ? 'ECDHE / DHE (Forward Secrecy)' : 'RSA Key Exchange (No FS)'}
          status={cert.forwardSecrecy ? 'good' : 'warn'}
          note={cert.forwardSecrecy ? 'Each session uses a unique key — past sessions are safe' : 'Past sessions may be decrypted if private key is compromised'}
          darkMode={darkMode}
        />
        <DetailRow
          icon={<Lock className="w-4 h-4" />}
          label="TLS Version"
          value={cert.tlsVersion}
          status={tlsStatus()}
          note={cert.tlsVersion === 'TLS 1.3' ? 'Latest protocol with improved security and performance' : cert.tlsVersion === 'TLS 1.2' ? 'Acceptable but upgrade to TLS 1.3 when possible' : 'This TLS version is deprecated and insecure'}
          darkMode={darkMode}
        />

        {/* Certificate Chain */}
        <div className={`flex items-center gap-4 p-3.5 rounded-xl ${darkMode ? 'bg-slate-900/40' : 'bg-slate-50'}`}>
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-white border border-slate-200 text-slate-500'}`}>
            <Globe className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Certificate Chain</div>
            <div className={`text-sm font-medium mt-0.5 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              {cert.isSelfSigned ? 'No chain (self-signed)' : `${cert.chainLength} certificates in chain`}
            </div>
            {!cert.isSelfSigned && (
              <div className="flex items-center gap-1 mt-1.5">
                {Array.from({ length: cert.chainLength }).map((_, i) => (
                  <React.Fragment key={i}>
                    <span className={`text-xs px-2 py-0.5 rounded ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-white border border-slate-200 text-slate-600'}`}>
                      {i === 0 ? 'Domain' : i === cert.chainLength - 1 ? 'Root CA' : 'Intermediate'}
                    </span>
                    {i < cert.chainLength - 1 && <span className={`text-xs ${darkMode ? 'text-slate-600' : 'text-slate-300'}`}>→</span>}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SANs */}
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-900/40' : 'bg-slate-50'}`}>
          <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Subject Alternative Names ({cert.san.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {visibleSans.map((name, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-mono font-medium ${
                  name.startsWith('*.') 
                    ? (darkMode ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-yellow-50 text-yellow-700 border border-yellow-200')
                    : (darkMode ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-cyan-50 text-cyan-700 border border-cyan-200')
                }`}
              >
                {name.startsWith('*.') ? '🌐' : '•'} {name}
              </span>
            ))}
            {cert.san.length > 4 && (
              <button
                onClick={() => setShowAllSans(!showAllSans)}
                className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${darkMode ? 'bg-slate-700 text-slate-400 hover:text-slate-200' : 'bg-slate-200 text-slate-500 hover:text-slate-700'}`}
              >
                {showAllSans ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> +{cert.san.length - 4} more</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

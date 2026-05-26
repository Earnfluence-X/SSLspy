import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Shield, Lock, Key, AlertTriangle } from 'lucide-react';

interface EducationalPanelProps {
  darkMode: boolean;
}

interface Topic {
  icon: React.ReactNode;
  title: string;
  content: string;
  tips?: string[];
}

const topics: Topic[] = [
  {
    icon: <Shield className="w-4 h-4" />,
    title: 'What is an SSL/TLS Certificate?',
    content: 'An SSL/TLS certificate is a digital document that authenticates a website\'s identity and enables encrypted communication between users and servers. Certificates are issued by trusted Certificate Authorities (CAs) and contain the website\'s public key, domain name, and validity period.',
    tips: [
      'Always look for the padlock icon before entering passwords',
      'Click the padlock to view certificate details in your browser',
      'HTTPS sites encrypt data in transit — HTTP sites do not',
    ],
  },
  {
    icon: <Key className="w-4 h-4" />,
    title: 'Public Key Cryptography',
    content: 'SSL/TLS uses asymmetric (public-key) cryptography. The server has a private key (kept secret) and a public key (shared in the certificate). Data encrypted with the public key can only be decrypted by the private key. This allows secure key exchange without pre-sharing secrets.',
    tips: [
      'RSA 2048-bit is the minimum recommended key size',
      'Elliptic Curve (EC) keys offer equal security with smaller sizes',
      'RSA 4096-bit offers extra protection but is slower',
    ],
  },
  {
    icon: <Lock className="w-4 h-4" />,
    title: 'TLS Versions Explained',
    content: 'TLS (Transport Layer Security) is the protocol that encrypts web traffic. TLS 1.3 (2018) is the latest and most secure version with improved performance and security. TLS 1.2 is still widely used but lacks some protections. TLS 1.0 and 1.1 are deprecated and should not be used.',
    tips: [
      'TLS 1.3 is faster due to fewer handshake round-trips',
      'TLS 1.3 removes weak cipher suites by design',
      'Verify your server configuration at SSL Labs',
    ],
  },
  {
    icon: <AlertTriangle className="w-4 h-4" />,
    title: 'Forward Secrecy',
    content: 'Forward secrecy (also called Perfect Forward Secrecy or PFS) ensures that each session uses unique encryption keys. Even if a server\'s private key is compromised later, past sessions remain secure. Implemented with ECDHE or DHE key exchange algorithms.',
    tips: [
      'ECDHE is preferred over DHE for performance',
      'Forward secrecy is automatically enabled in TLS 1.3',
      'Look for ECDHE cipher suites in TLS 1.2 configurations',
    ],
  },
  {
    icon: <Shield className="w-4 h-4" />,
    title: 'Certificate Transparency (CT)',
    content: 'Certificate Transparency is a system where all publicly-trusted certificates must be logged in public CT logs. This makes it impossible for CAs to issue certificates secretly. You can search certificate transparency logs at crt.sh to see all certificates issued for a domain.',
    tips: [
      'CT logs are monitored to detect unauthorized certificates',
      'Multi-Perspective Issuance Corroboration (MPIC) adds extra validation',
      'Domain owners can monitor CT logs for misuse',
    ],
  },
];

export const EducationalPanel: React.FC<EducationalPanelProps> = ({ darkMode }) => {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200'}`}>
      <div className={`px-5 py-3.5 border-b flex items-center gap-2 ${darkMode ? 'border-slate-700/60' : 'border-slate-100'}`}>
        <BookOpen className="w-4 h-4 text-cyan-500" />
        <h2 className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          Learn About SSL/TLS
        </h2>
      </div>

      <div className="p-5 space-y-2">
        {topics.map((topic, i) => (
          <div key={i} className={`rounded-xl overflow-hidden border transition-all ${
            expanded === i
              ? (darkMode ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-cyan-200 bg-cyan-50/50')
              : (darkMode ? 'border-slate-700/40 bg-slate-900/30' : 'border-slate-100 bg-slate-50/50')
          }`}>
            <button
              className="w-full flex items-center justify-between p-4 text-left"
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${expanded === i ? 'bg-cyan-500/20 text-cyan-400' : (darkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500')}`}>
                  {topic.icon}
                </div>
                <span className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{topic.title}</span>
              </div>
              <div className={`${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {expanded === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>
            {expanded === i && (
              <div className={`px-4 pb-4 border-t ${darkMode ? 'border-slate-700/40' : 'border-cyan-100'}`}>
                <p className={`text-sm leading-relaxed mt-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {topic.content}
                </p>
                {topic.tips && (
                  <div className="mt-3 space-y-1.5">
                    {topic.tips.map((tip, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <span className="text-cyan-500 text-xs mt-0.5">→</span>
                        <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{tip}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className={`mx-5 mb-5 p-4 rounded-xl border ${darkMode ? 'bg-blue-500/5 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
        <div className="flex items-start gap-2">
          <span className="text-base">🔒</span>
          <div>
            <div className="text-xs font-bold uppercase tracking-wide mb-1">Disclaimer</div>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-blue-300/80' : 'text-blue-600'}`}>
              SSLSpy uses simulated certificate data for demonstration purposes. Results are for educational use only. 
              Always verify certificates manually for sensitive transactions. Real certificate inspection requires direct 
              server connection or trusted CA verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ShieldCheck, ShieldX, Clock, Building2, Award, Calendar } from 'lucide-react';
import type { CertificateData } from '../types/certificate';
import { formatDate, getStatusColor } from '../utils/certificateSimulator';

interface CertSummaryProps {
  cert: CertificateData;
  darkMode: boolean;
}

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'valid') return <ShieldCheck className="w-6 h-6" />;
  if (status === 'expiring_soon') return <Clock className="w-6 h-6" />;
  return <ShieldX className="w-6 h-6" />;
};

const statusLabel = (status: string, days: number) => {
  if (status === 'valid') return `VALID – Expires in ${days} days`;
  if (status === 'expiring_soon') return `EXPIRING SOON – ${days} days remaining`;
  if (status === 'expired') return `EXPIRED – ${Math.abs(days)} days ago`;
  if (status === 'self_signed') return 'SELF-SIGNED – Not trusted by browsers';
  return 'UNKNOWN';
};

interface FieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  darkMode: boolean;
}

const Field: React.FC<FieldProps> = ({ icon, label, value, mono, darkMode }) => (
  <div className="flex items-start gap-3">
    <div className={`mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{icon}</div>
    <div className="min-w-0">
      <div className={`text-xs uppercase tracking-wider font-semibold mb-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{label}</div>
      <div className={`text-sm break-all ${mono ? 'font-mono' : 'font-medium'} ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{value}</div>
    </div>
  </div>
);

export const CertSummary: React.FC<CertSummaryProps> = ({ cert, darkMode }) => {
  const colors = getStatusColor(cert.status);
  const subjectStr = [
    cert.subject.cn ? `CN=${cert.subject.cn}` : null,
    cert.subject.o ? `O=${cert.subject.o}` : null,
    cert.subject.c ? `C=${cert.subject.c}` : null,
  ].filter(Boolean).join(', ');

  const issuerStr = [
    cert.issuer.cn ? `CN=${cert.issuer.cn}` : null,
    cert.issuer.o ? `O=${cert.issuer.o}` : null,
  ].filter(Boolean).join(', ');

  return (
    <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200'}`}>
      <div className={`px-5 py-3.5 border-b flex items-center gap-2 ${darkMode ? 'border-slate-700/60' : 'border-slate-100'}`}>
        <ShieldCheck className="w-4 h-4 text-cyan-500" />
        <h2 className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          Certificate Summary
        </h2>
      </div>

      <div className="p-5 space-y-5">
        {/* Status Banner */}
        <div className={`flex items-center gap-4 p-4 rounded-xl border ${colors.bg} ${colors.border}`}>
          <div className={`p-2 rounded-xl ${colors.bg} ${colors.text}`}>
            <StatusIcon status={cert.status} />
          </div>
          <div>
            <div className={`text-base font-bold ${colors.text}`}>
              {statusLabel(cert.status, cert.daysRemaining)}
            </div>
            <div className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {cert.isSelfSigned ? 'Certificate is self-signed and will not be trusted by browsers' :
               cert.status === 'valid' ? 'Certificate is valid and trusted' :
               cert.status === 'expired' ? 'This certificate has expired and connections are insecure' :
               'Certificate will expire soon — renew immediately'}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
          <Field icon={<Building2 className="w-4 h-4" />} label="Subject" value={subjectStr} darkMode={darkMode} />
          <Field icon={<Award className="w-4 h-4" />} label="Issuer" value={issuerStr} darkMode={darkMode} />
          <Field icon={<Calendar className="w-4 h-4" />} label="Valid From" value={formatDate(cert.validFrom)} darkMode={darkMode} />
          <Field icon={<Calendar className="w-4 h-4" />} label="Valid To" value={`${formatDate(cert.validTo)} (${cert.daysRemaining > 0 ? cert.daysRemaining + ' days remaining' : Math.abs(cert.daysRemaining) + ' days ago'})`} darkMode={darkMode} />
        </div>

        {/* Serial & Fingerprints */}
        <div className={`rounded-xl p-4 space-y-2 ${darkMode ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
          <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Technical Identifiers</div>
          <div className="grid gap-2">
            <div className="flex items-start gap-2">
              <span className={`text-xs font-semibold w-24 shrink-0 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Serial No.</span>
              <span className={`text-xs font-mono break-all ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{cert.serialNumber}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className={`text-xs font-semibold w-24 shrink-0 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>SHA-256</span>
              <span className={`text-xs font-mono break-all ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{cert.fingerprint.sha256}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className={`text-xs font-semibold w-24 shrink-0 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>SHA-1</span>
              <span className={`text-xs font-mono break-all ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{cert.fingerprint.sha1}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

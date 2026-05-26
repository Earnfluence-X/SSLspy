export type CertStatus = 'valid' | 'expired' | 'expiring_soon' | 'self_signed' | 'not_trusted' | 'error';

export interface SanEntry {
  name: string;
}

export interface CertificateData {
  domain: string;
  status: CertStatus;
  subject: {
    cn: string;
    o?: string;
    ou?: string;
    l?: string;
    st?: string;
    c?: string;
  };
  issuer: {
    cn: string;
    o?: string;
    c?: string;
  };
  validFrom: string;   // ISO date string
  validTo: string;     // ISO date string
  daysRemaining: number;
  serialNumber: string;
  fingerprint: {
    sha256: string;
    sha1: string;
  };
  publicKey: {
    algorithm: string; // RSA, EC
    keySize: number;
    curve?: string;
  };
  signatureAlgorithm: string;
  tlsVersion: string;
  forwardSecrecy: boolean;
  san: string[];
  isWildcard: boolean;
  isSelfSigned: boolean;
  chainLength: number;
  ocspUrl?: string;
  crlUrl?: string;
  pem: string;
  score: number;
  grade: string;
  scoreBreakdown: ScoreItem[];
}

export interface ScoreItem {
  label: string;
  points: number;
  positive: boolean;
  description: string;
}

export interface HistoryEntry {
  domain: string;
  checkedAt: string;
  status: CertStatus;
  grade: string;
}

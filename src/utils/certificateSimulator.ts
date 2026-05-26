import type { CertificateData, ScoreItem, CertStatus } from '../types/certificate';

// Deterministic pseudo-random based on domain string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRand(seed: number, min: number, max: number): number {
  const x = Math.sin(seed) * 10000;
  const r = x - Math.floor(x);
  return Math.floor(r * (max - min + 1)) + min;
}

// Well-known domain presets
const DOMAIN_PRESETS: Record<string, Partial<CertificateData>> = {
  'google.com': {
    issuer: { cn: 'GTS CA 1C3', o: 'Google Trust Services LLC', c: 'US' },
    publicKey: { algorithm: 'EC', keySize: 256, curve: 'prime256v1' },
    signatureAlgorithm: 'SHA-256 with ECDSA',
    tlsVersion: 'TLS 1.3',
    forwardSecrecy: true,
    san: ['google.com', 'www.google.com', '*.google.com'],
    chainLength: 3,
  },
  'github.com': {
    issuer: { cn: 'DigiCert TLS Hybrid ECC SHA384 2020 CA1', o: 'DigiCert Inc', c: 'US' },
    publicKey: { algorithm: 'EC', keySize: 384, curve: 'secp384r1' },
    signatureAlgorithm: 'SHA-384 with ECDSA',
    tlsVersion: 'TLS 1.3',
    forwardSecrecy: true,
    san: ['github.com', 'www.github.com'],
    chainLength: 3,
  },
  'cloudflare.com': {
    issuer: { cn: 'E1', o: "Let's Encrypt", c: 'US' },
    publicKey: { algorithm: 'EC', keySize: 256, curve: 'prime256v1' },
    signatureAlgorithm: 'SHA-256 with ECDSA',
    tlsVersion: 'TLS 1.3',
    forwardSecrecy: true,
    san: ['cloudflare.com', 'www.cloudflare.com'],
    chainLength: 2,
  },
  'example.com': {
    issuer: { cn: 'DigiCert TLS RSA SHA256 2020 CA1', o: 'DigiCert Inc', c: 'US' },
    publicKey: { algorithm: 'RSA', keySize: 2048 },
    signatureAlgorithm: 'SHA-256 with RSA',
    tlsVersion: 'TLS 1.3',
    forwardSecrecy: true,
    san: ['example.com', 'www.example.com', 'example.net'],
    chainLength: 3,
  },
  'badssl.com': {
    issuer: { cn: 'COMODO RSA Domain Validation Secure Server CA', o: 'COMODO CA Limited', c: 'GB' },
    publicKey: { algorithm: 'RSA', keySize: 2048 },
    signatureAlgorithm: 'SHA-256 with RSA',
    tlsVersion: 'TLS 1.2',
    forwardSecrecy: false,
    san: ['badssl.com', 'www.badssl.com'],
    chainLength: 3,
  },
};

const CA_ISSUERS = [
  { cn: "Let's Encrypt R3", o: "Let's Encrypt", c: 'US' },
  { cn: 'DigiCert TLS RSA SHA256 2020 CA1', o: 'DigiCert Inc', c: 'US' },
  { cn: 'Sectigo RSA Domain Validation Secure Server CA', o: 'Sectigo Limited', c: 'GB' },
  { cn: 'GTS CA 1C3', o: 'Google Trust Services LLC', c: 'US' },
  { cn: 'Amazon RSA 2048 M02', o: 'Amazon', c: 'US' },
  { cn: 'GlobalSign Atlas R3 DV TLS CA 2025 Q1', o: 'GlobalSign nv-sa', c: 'BE' },
  { cn: 'Cloudflare Inc ECC CA-3', o: 'Cloudflare, Inc.', c: 'US' },
];

function generatePEM(domain: string): string {
  // Generate realistic-looking (but fake) PEM data
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const seed = hashString(domain + 'pem');
  let raw = '';
  for (let i = 0; i < 1200; i++) {
    raw += chars[seededRand(seed + i, 0, chars.length - 1)];
    if ((i + 1) % 64 === 0) raw += '\n';
  }
  return `-----BEGIN CERTIFICATE-----\n${raw}\n-----END CERTIFICATE-----`;
}

function generateFingerprint(domain: string, type: 'sha256' | 'sha1'): string {
  const hex = '0123456789ABCDEF';
  const seed = hashString(domain + type);
  const len = type === 'sha256' ? 32 : 20;
  const parts: string[] = [];
  for (let i = 0; i < len; i++) {
    parts.push(hex[seededRand(seed + i * 3, 0, 15)] + hex[seededRand(seed + i * 3 + 1, 0, 15)]);
  }
  return parts.join(':');
}

function generateSerial(domain: string): string {
  const hex = '0123456789abcdef';
  const seed = hashString(domain + 'serial');
  let serial = '';
  for (let i = 0; i < 32; i++) {
    serial += hex[seededRand(seed + i, 0, 15)];
  }
  return serial.match(/.{1,2}/g)!.join(':').toUpperCase();
}

function calcScore(data: Partial<CertificateData> & { daysRemaining: number; isSelfSigned: boolean }): {
  score: number;
  grade: string;
  breakdown: ScoreItem[];
} {
  let score = 60;
  const breakdown: ScoreItem[] = [];

  // Key size
  const keySize = data.publicKey?.keySize ?? 2048;
  const algo = data.publicKey?.algorithm ?? 'RSA';
  if (algo === 'EC') {
    if (keySize >= 384) {
      breakdown.push({ label: 'EC Key Size (≥384 bit)', points: 10, positive: true, description: 'Excellent elliptic curve key size' });
      score += 10;
    } else if (keySize >= 256) {
      breakdown.push({ label: 'EC Key Size (256 bit)', points: 8, positive: true, description: 'Good elliptic curve key size' });
      score += 8;
    } else {
      breakdown.push({ label: 'Weak EC Key Size', points: -20, positive: false, description: 'EC key size is insufficient' });
      score -= 20;
    }
  } else {
    if (keySize >= 4096) {
      breakdown.push({ label: 'RSA Key Size (≥4096 bit)', points: 10, positive: true, description: 'Strong RSA key size' });
      score += 10;
    } else if (keySize >= 2048) {
      breakdown.push({ label: 'RSA Key Size (≥2048 bit)', points: 8, positive: true, description: 'Adequate RSA key size' });
      score += 8;
    } else {
      breakdown.push({ label: 'Weak RSA Key Size (<2048)', points: -40, positive: false, description: 'RSA key is too short and vulnerable' });
      score -= 40;
    }
  }

  // Signature algorithm
  const sigAlgo = data.signatureAlgorithm ?? '';
  if (sigAlgo.includes('SHA-1') || sigAlgo.toLowerCase().includes('sha1')) {
    breakdown.push({ label: 'SHA-1 Signature (deprecated)', points: -30, positive: false, description: 'SHA-1 is cryptographically broken' });
    score -= 30;
  } else if (sigAlgo.includes('SHA-384') || sigAlgo.includes('SHA-512')) {
    breakdown.push({ label: 'Strong Signature Algorithm', points: 7, positive: true, description: 'SHA-384/512 signature algorithm' });
    score += 7;
  } else {
    breakdown.push({ label: 'Modern Signature Algorithm', points: 5, positive: true, description: 'SHA-256 or better signature algorithm' });
    score += 5;
  }

  // TLS Version
  const tls = data.tlsVersion ?? 'TLS 1.2';
  if (tls === 'TLS 1.3') {
    breakdown.push({ label: 'TLS 1.3 Supported', points: 10, positive: true, description: 'Latest TLS protocol version' });
    score += 10;
  } else if (tls === 'TLS 1.2') {
    breakdown.push({ label: 'TLS 1.2 (no 1.3)', points: 3, positive: true, description: 'TLS 1.2 is acceptable but 1.3 is better' });
    score += 3;
  } else {
    breakdown.push({ label: 'Outdated TLS Version', points: -20, positive: false, description: 'TLS 1.0/1.1 are deprecated and insecure' });
    score -= 20;
  }

  // Forward secrecy
  if (data.forwardSecrecy) {
    breakdown.push({ label: 'Forward Secrecy Enabled', points: 5, positive: true, description: 'ECDHE/DHE key exchange protects past sessions' });
    score += 5;
  } else {
    breakdown.push({ label: 'No Forward Secrecy', points: -10, positive: false, description: 'Past sessions may be decrypted if key is compromised' });
    score -= 10;
  }

  // Expiry
  if (data.daysRemaining <= 0) {
    breakdown.push({ label: 'Certificate Expired', points: -50, positive: false, description: 'Certificate has already expired' });
    score -= 50;
  } else if (data.daysRemaining <= 7) {
    breakdown.push({ label: 'Expiring Very Soon (<7 days)', points: -20, positive: false, description: 'Certificate expires in less than a week' });
    score -= 20;
  } else if (data.daysRemaining <= 30) {
    breakdown.push({ label: 'Expiring Soon (<30 days)', points: -15, positive: false, description: 'Certificate expires within a month' });
    score -= 15;
  } else if (data.daysRemaining > 180) {
    breakdown.push({ label: 'Long Validity Period', points: 2, positive: true, description: 'Certificate has more than 6 months remaining' });
    score += 2;
  }

  // Self-signed
  if (data.isSelfSigned) {
    breakdown.push({ label: 'Self-Signed Certificate', points: -40, positive: false, description: 'Not issued by a trusted CA – browsers will warn' });
    score -= 40;
  }

  // Wildcard
  const isWild = data.san?.some(s => s.startsWith('*.'));
  if (isWild) {
    breakdown.push({ label: 'Wildcard Certificate', points: -3, positive: false, description: 'Wildcard certs cover many subdomains – monitor usage' });
    score -= 3;
  }

  score = Math.max(0, Math.min(100, score));

  let grade = 'F';
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';

  return { score, grade, breakdown };
}

export async function fetchCertificate(rawDomain: string): Promise<CertificateData> {
  // Normalize domain
  let domain = rawDomain.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//, '');
  domain = domain.split('/')[0];
  domain = domain.split('?')[0];
  domain = domain.split('#')[0];

  if (!domain || domain.length < 3 || !domain.includes('.')) {
    throw new Error('Please enter a valid domain (e.g., example.com)');
  }

  // Simulate network delay
  await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));

  const seed = hashString(domain);
  const preset = DOMAIN_PRESETS[domain] ?? {};

  // Date calculations
  const now = new Date();
  const validFromOffset = seededRand(seed + 1, 30, 120); // days ago
  const validityPeriod = seededRand(seed + 2, 60, 398); // days total
  const validFrom = new Date(now.getTime() - validFromOffset * 86400000);
  const validTo = new Date(validFrom.getTime() + validityPeriod * 86400000);
  const daysRemaining = Math.floor((validTo.getTime() - now.getTime()) / 86400000);

  // For demo: some domains get edge-case scenarios
  let forcedScenario = '';
  if (domain.includes('expired')) forcedScenario = 'expired';
  if (domain.includes('selfSign') || domain.includes('self-sign')) forcedScenario = 'self_signed';
  if (domain.includes('sha1')) forcedScenario = 'sha1';
  if (domain.includes('weak')) forcedScenario = 'weak';

  const isSelfSigned = forcedScenario === 'self_signed' || (!preset.issuer && seededRand(seed + 10, 0, 20) === 0);
  const isExpired = forcedScenario === 'expired' || (!preset.validFrom && daysRemaining < -10 && seededRand(seed + 11, 0, 10) === 0);
  const isWildcard = preset.san ? preset.san.some(s => s.startsWith('*.')) : seededRand(seed + 12, 0, 3) === 0;

  const issuerIndex = seededRand(seed + 3, 0, CA_ISSUERS.length - 1);
  const issuer = isSelfSigned
    ? { cn: domain, o: 'Self-Signed', c: 'N/A' }
    : (preset.issuer ?? CA_ISSUERS[issuerIndex]);

  const publicKey = preset.publicKey ?? (
    seededRand(seed + 4, 0, 3) === 0
      ? { algorithm: 'EC' as const, keySize: 256, curve: 'prime256v1' }
      : { algorithm: 'RSA' as const, keySize: seededRand(seed + 5, 0, 4) === 0 ? 4096 : 2048 }
  );

  let signatureAlgorithm = preset.signatureAlgorithm ?? (
    forcedScenario === 'sha1' ? 'SHA-1 with RSA' :
    publicKey.algorithm === 'EC' ? 'SHA-256 with ECDSA' : 'SHA-256 with RSA'
  );

  if (forcedScenario === 'weak') {
    publicKey.algorithm = 'RSA';
    publicKey.keySize = 1024;
    signatureAlgorithm = 'SHA-1 with RSA';
  }

  const tlsVersion = preset.tlsVersion ?? (seededRand(seed + 6, 0, 5) === 0 ? 'TLS 1.2' : 'TLS 1.3');
  const forwardSecrecy = preset.forwardSecrecy ?? (tlsVersion === 'TLS 1.3' || seededRand(seed + 7, 0, 3) > 0);

  const san: string[] = preset.san ?? (() => {
    const names = [domain];
    if (!isWildcard) {
      if (!domain.startsWith('www.')) names.push('www.' + domain);
    } else {
      names.push('*.' + domain);
    }
    return names;
  })();

  let status: CertStatus;
  if (isExpired || daysRemaining < 0) status = 'expired';
  else if (isSelfSigned) status = 'self_signed';
  else if (daysRemaining <= 30) status = 'expiring_soon';
  else status = 'valid';

  const orgName = domain
    .replace(/\.(com|net|org|io|dev|co|app)(\.[a-z]{2})?$/, '')
    .replace(/[^a-z0-9]/gi, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const certData: Omit<CertificateData, 'score' | 'grade' | 'scoreBreakdown'> = {
    domain,
    status,
    subject: {
      cn: isWildcard ? '*.' + domain : domain,
      o: isSelfSigned ? undefined : orgName + (seededRand(seed + 8, 0, 1) ? ', Inc.' : ' Ltd.'),
      c: 'US',
    },
    issuer,
    validFrom: validFrom.toISOString().split('T')[0],
    validTo: validTo.toISOString().split('T')[0],
    daysRemaining: isExpired ? -Math.abs(daysRemaining) : daysRemaining,
    serialNumber: generateSerial(domain),
    fingerprint: {
      sha256: generateFingerprint(domain, 'sha256'),
      sha1: generateFingerprint(domain, 'sha1'),
    },
    publicKey,
    signatureAlgorithm,
    tlsVersion,
    forwardSecrecy,
    san,
    isWildcard,
    isSelfSigned,
    chainLength: isSelfSigned ? 1 : seededRand(seed + 9, 2, 3),
    ocspUrl: isSelfSigned ? undefined : `http://ocsp.${issuer.o?.toLowerCase().replace(/ /g, '') ?? 'ca'}.com`,
    crlUrl: isSelfSigned ? undefined : `http://crl.${issuer.o?.toLowerCase().replace(/ /g, '') ?? 'ca'}.com/ca.crl`,
    pem: generatePEM(domain),
  };

  const { score, grade, breakdown } = calcScore({
    ...certData,
    daysRemaining: certData.daysRemaining,
    isSelfSigned: certData.isSelfSigned,
  });

  return { ...certData, score, grade, scoreBreakdown: breakdown };
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A': return 'text-emerald-400';
    case 'B': return 'text-green-400';
    case 'C': return 'text-yellow-400';
    case 'D': return 'text-orange-400';
    default: return 'text-red-400';
  }
}

export function getStatusColor(status: CertStatus): { bg: string; text: string; border: string } {
  switch (status) {
    case 'valid': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' };
    case 'expiring_soon': return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' };
    case 'expired': return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' };
    case 'self_signed': return { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' };
    case 'not_trusted': return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' };
    default: return { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' };
  }
}

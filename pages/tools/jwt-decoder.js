import React, { useState, useMemo } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';

export default function JwtDecoder() {
  const [token, setToken] = useState('');

  const decoded = useMemo(() => {
    if (!token.trim()) return null;
    try {
      const parts = token.trim().split('.');
      if (parts.length !== 3) return { error: 'Invalid JWT: Expected 3 parts (header.payload.signature)' };

      const decodeB64 = (str) => {
        // Handle base64url to standard base64
        const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
        return JSON.parse(decodeURIComponent(escape(atob(padded))));
      };

      const header = decodeB64(parts[0]);
      const payload = decodeB64(parts[1]);

      // Check expiration
      let expirationInfo = null;
      if (payload.exp) {
        const expDate = new Date(payload.exp * 1000);
        const isExpired = expDate < new Date();
        expirationInfo = {
          date: expDate.toLocaleString(),
          isExpired,
          timeAgo: isExpired
            ? `Expired ${getTimeAgo(expDate)}`
            : `Expires ${getTimeUntil(expDate)}`,
        };
      }

      let issuedInfo = null;
      if (payload.iat) {
        issuedInfo = new Date(payload.iat * 1000).toLocaleString();
      }

      return { header, payload, signature: parts[2], expirationInfo, issuedInfo, error: null };
    } catch (err) {
      return { error: `Failed to decode: ${err.message}` };
    }
  }, [token]);

  const handleSample = () => {
    // Generate a sample JWT (non-secret, for demo only)
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).replace(/=/g, '');
    const payload = btoa(JSON.stringify({
      sub: '1234567890', name: 'Ibrahim Ben Salah', iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, role: 'admin', email: 'hello@progrmrslife.com'
    })).replace(/=/g, '');
    setToken(`${header}.${payload}.dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk`);
  };

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "JWT Decoder",
    "description": "Free online JWT decoder. Inspect JSON Web Token header, payload, expiration, and signature.",
    "url": "https://www.progrmrslife.com/tools/jwt-decoder",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  };

  return (
    <ToolLayout toolSlug="jwt-decoder" schemaMarkup={schemaMarkup}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            JWT Decoder
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Paste a JSON Web Token to inspect its header, payload, and signature. Checks expiration instantly.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={handleSample} className="tool-btn tool-btn-secondary" type="button">
            <span>📋</span> Load Sample JWT
          </button>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 block">
            Token
          </label>
          <textarea
            className="tool-editor"
            style={{ minHeight: '100px' }}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your JWT token here… (eyJhbGciOiJIUzI1Ni…)"
            spellCheck={false}
          />
        </div>

        {decoded?.error && (
          <div className="tool-badge tool-badge-error">{decoded.error}</div>
        )}

        {decoded && !decoded.error && (
          <div className="space-y-4">
            {/* Expiration Warning */}
            {decoded.expirationInfo && (
              <div className={`tool-badge ${decoded.expirationInfo.isExpired ? 'tool-badge-error' : 'tool-badge-success'}`}>
                {decoded.expirationInfo.isExpired ? '⚠️ ' : '✓ '}
                {decoded.expirationInfo.timeAgo}
                <span className="ml-2 opacity-70">({decoded.expirationInfo.date})</span>
              </div>
            )}

            {/* Header */}
            <JwtSection title="Header" color="violet" data={decoded.header} />

            {/* Payload */}
            <JwtSection title="Payload" color="blue" data={decoded.payload}>
              {decoded.issuedInfo && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  🕐 Issued at: {decoded.issuedInfo}
                </div>
              )}
            </JwtSection>

            {/* Signature */}
            <div className="tool-glass p-4">
              <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2">
                Signature
              </h3>
              <code className="text-xs text-gray-600 dark:text-gray-400 break-all font-mono">
                {decoded.signature}
              </code>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 italic">
                ⚠️ Signature verification requires the secret key — not done client-side.
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

function JwtSection({ title, color, data, children }) {
  const colorMap = {
    violet: 'text-violet-600 dark:text-violet-400',
    blue: 'text-blue-600 dark:text-blue-400',
    rose: 'text-rose-600 dark:text-rose-400',
  };

  return (
    <div className="tool-glass p-4">
      <h3 className={`text-sm font-bold ${colorMap[color] || ''} uppercase tracking-wider mb-2`}>
        {title}
      </h3>
      <pre className="tool-output text-xs" style={{ minHeight: 'auto', maxHeight: '300px' }}>
        {JSON.stringify(data, null, 2)}
      </pre>
      {children}
    </div>
  );
}

function getTimeAgo(date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getTimeUntil(date) {
  const diff = date.getTime() - Date.now();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `in ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `in ${hours}h`;
  const days = Math.floor(hours / 24);
  return `in ${days}d`;
}

import React, { useState, useCallback } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
  });
  const [count, setCount] = useState(5);
  const [passwords, setPasswords] = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(-1);

  const generate = useCallback(() => {
    let charset = '';
    if (options.lowercase) charset += options.excludeAmbiguous ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
    if (options.uppercase) charset += options.excludeAmbiguous ? 'ABCDEFGHJKMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.numbers) charset += options.excludeAmbiguous ? '23456789' : '0123456789';
    if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';

    const results = [];
    for (let i = 0; i < count; i++) {
      let pw = '';
      const array = new Uint32Array(length);
      crypto.getRandomValues(array);
      for (let j = 0; j < length; j++) {
        pw += charset[array[j] % charset.length];
      }
      results.push(pw);
    }
    setPasswords(results);
  }, [length, options, count]);

  const handleCopy = async (pw, idx) => {
    try {
      await navigator.clipboard.writeText(pw);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(-1), 1500);
    } catch { /* ignore */ }
  };

  const getStrength = (len) => {
    const charsetSize =
      (options.lowercase ? 26 : 0) +
      (options.uppercase ? 26 : 0) +
      (options.numbers ? 10 : 0) +
      (options.symbols ? 26 : 0);
    const entropy = len * Math.log2(charsetSize || 26);
    if (entropy < 40) return { label: 'Weak', color: 'text-red-500', bg: 'bg-red-500', pct: 25 };
    if (entropy < 60) return { label: 'Fair', color: 'text-amber-500', bg: 'bg-amber-500', pct: 50 };
    if (entropy < 80) return { label: 'Strong', color: 'text-green-500', bg: 'bg-green-500', pct: 75 };
    return { label: 'Very Strong', color: 'text-emerald-500', bg: 'bg-emerald-500', pct: 100 };
  };

  const strength = getStrength(length);

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Password Generator",
    "description": "Free secure password generator using cryptographic randomness. Customize length, character sets, and generate multiple passwords at once.",
    "url": "https://www.progrmrslife.com/tools/password-generator",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  };

  return (
    <ToolLayout toolSlug="password-generator" schemaMarkup={schemaMarkup}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Password Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate cryptographically secure passwords. Customize character sets, length, and batch generate multiple passwords.
          </p>
        </div>

        {/* Controls */}
        <div className="tool-glass p-5 space-y-4">
          {/* Length Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-gray-900 dark:text-white">Length</label>
              <span className="text-sm font-mono font-bold text-violet-600 dark:text-violet-400">{length}</span>
            </div>
            <input
              type="range" min="4" max="128" value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-violet-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>4</span><span>32</span><span>64</span><span>128</span>
            </div>
          </div>

          {/* Strength Bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500 dark:text-gray-400">Strength</span>
              <span className={`font-bold ${strength.color}`}>{strength.label}</span>
            </div>
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className={`h-full ${strength.bg} rounded-full transition-all duration-300`} style={{ width: `${strength.pct}%` }} />
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { key: 'uppercase', label: 'A-Z' },
              { key: 'lowercase', label: 'a-z' },
              { key: 'numbers', label: '0-9' },
              { key: 'symbols', label: '!@#$%' },
              { key: 'excludeAmbiguous', label: 'No ambiguous (0Ol1I)' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options[key]}
                  onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                  className="accent-violet-600 rounded"
                />
                {label}
              </label>
            ))}
          </div>

          {/* Count */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Generate</label>
            <input
              type="number" min="1" max="20" value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="tool-editor px-2 py-1 text-sm text-center"
              style={{ minHeight: 'auto', width: '60px' }}
            />
            <span className="text-sm text-gray-500">password{count !== 1 ? 's' : ''}</span>
          </div>

          <button onClick={generate} className="tool-btn tool-btn-primary w-full justify-center" type="button">
            <span>🔐</span> Generate Passwords
          </button>
        </div>

        {/* Results */}
        {passwords.length > 0 && (
          <div className="space-y-2">
            {passwords.map((pw, i) => (
              <div key={i} className="tool-glass p-3 flex items-center justify-between gap-3 group">
                <code className="text-sm font-mono text-gray-800 dark:text-gray-200 break-all flex-1 select-all">
                  {pw}
                </code>
                <button
                  onClick={() => handleCopy(pw, i)}
                  className="tool-btn tool-btn-secondary text-xs py-0.5 px-2 flex-shrink-0"
                  type="button"
                >
                  {copiedIdx === i ? '✓' : '📋'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

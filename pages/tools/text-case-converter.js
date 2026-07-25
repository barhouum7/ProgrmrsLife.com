import React, { useState, useCallback } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';
import CodeEditor from '../../components/tools/CodeEditor';

export default function TextCaseConverter() {
  const [input, setInput] = useState('');

  const conversions = [
    { label: 'UPPERCASE', icon: 'A→A', fn: (s) => s.toUpperCase() },
    { label: 'lowercase', icon: 'A→a', fn: (s) => s.toLowerCase() },
    { label: 'Title Case', icon: 'A→Aa', fn: (s) => s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) },
    { label: 'Sentence case', icon: 'A→A.', fn: (s) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()) },
    { label: 'camelCase', icon: 'aB', fn: (s) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
    { label: 'PascalCase', icon: 'AB', fn: (s) => s.toLowerCase().replace(/(^|[^a-zA-Z0-9]+)(.)/g, (_, _p, c) => c.toUpperCase()) },
    { label: 'snake_case', icon: 'a_b', fn: (s) => s.replace(/\s+/g, '_').replace(/[A-Z]/g, (c) => '_' + c.toLowerCase()).replace(/^_+|_+$/g, '').replace(/_+/g, '_').toLowerCase() },
    { label: 'kebab-case', icon: 'a-b', fn: (s) => s.replace(/\s+/g, '-').replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()).replace(/^-+|-+$/g, '').replace(/-+/g, '-').toLowerCase() },
    { label: 'CONSTANT_CASE', icon: 'A_B', fn: (s) => s.replace(/\s+/g, '_').replace(/[A-Z]/g, (c) => '_' + c).replace(/^_+|_+$/g, '').replace(/_+/g, '_').toUpperCase() },
    { label: 'dot.case', icon: 'a.b', fn: (s) => s.replace(/\s+/g, '.').replace(/[A-Z]/g, (c) => '.' + c.toLowerCase()).replace(/^\.+|\.+$/g, '').replace(/\.+/g, '.').toLowerCase() },
    { label: 'Alternating', icon: 'aLt', fn: (s) => s.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('') },
    { label: 'Reverse', icon: '⟲', fn: (s) => s.split('').reverse().join('') },
  ];

  const [results, setResults] = useState({});

  const convertAll = useCallback(() => {
    if (!input.trim()) return;
    const r = {};
    conversions.forEach(({ label, fn }) => {
      r[label] = fn(input);
    });
    setResults(r);
  }, [input]);

  const handleCopy = async (text) => {
    try { await navigator.clipboard.writeText(text); } catch { /* */ }
  };

  const wordCount = input ? input.split(/\s+/).filter(Boolean).length : 0;
  const charCount = input.length;
  const lineCount = input ? input.split('\n').length : 0;

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Text Case Converter",
    "description": "Free online text case converter. Convert text to uppercase, lowercase, title case, camelCase, snake_case, kebab-case, and more.",
    "url": "https://www.progrmrslife.com/tools/text-case-converter",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  };

  return (
    <ToolLayout toolSlug="text-case-converter" schemaMarkup={schemaMarkup}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Text Case Converter
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Convert text between 12 different cases instantly. Perfect for variable naming, content formatting, and coding conventions.
          </p>
        </div>

        <div>
          <CodeEditor
            value={input}
            onChange={setInput}
            label="Input Text"
            placeholder="Type or paste your text here…"
            language="text"
            minHeight="100px"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button onClick={convertAll} className="tool-btn tool-btn-primary" disabled={!input.trim()} type="button">
            <span>🔄</span> Convert All
          </button>

          {input.trim() && (
            <div className="flex gap-2 text-xs text-gray-400 dark:text-gray-500">
              <span>{wordCount} words</span>
              <span>·</span>
              <span>{charCount} chars</span>
              <span>·</span>
              <span>{lineCount} lines</span>
            </div>
          )}
        </div>

        {/* Results Grid */}
        {Object.keys(results).length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {conversions.map(({ label, icon }) => (
              <div key={label} className="tool-glass p-3 group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/30 px-1.5 py-0.5 rounded">
                      {icon}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {label}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(results[label])}
                    className="tool-btn tool-btn-secondary text-[10px] py-0 px-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    type="button"
                  >
                    📋
                  </button>
                </div>
                <code className="text-sm text-gray-700 dark:text-gray-300 font-mono break-all leading-relaxed block line-clamp-3">
                  {results[label]}
                </code>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

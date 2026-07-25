import React, { useState, useMemo } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');

  const flagOptions = [
    { flag: 'g', label: 'Global' },
    { flag: 'i', label: 'Case-insensitive' },
    { flag: 'm', label: 'Multiline' },
    { flag: 's', label: 'Dotall' },
    { flag: 'u', label: 'Unicode' },
  ];

  const toggleFlag = (f) => {
    setFlags((prev) => (prev.includes(f) ? prev.replace(f, '') : prev + f));
  };

  const { matches, error, highlightedHtml } = useMemo(() => {
    if (!pattern || !testString) return { matches: [], error: null, highlightedHtml: '' };
    try {
      const regex = new RegExp(pattern, flags);
      const matchArr = [];
      let match;

      if (flags.includes('g')) {
        while ((match = regex.exec(testString)) !== null) {
          matchArr.push({
            value: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (match.index === regex.lastIndex) regex.lastIndex++;
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          matchArr.push({
            value: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      // Build highlighted HTML
      let html = '';
      let lastIdx = 0;
      matchArr.forEach((m) => {
        html += escapeHtml(testString.slice(lastIdx, m.index));
        html += `<mark class="regex-match">${escapeHtml(m.value)}</mark>`;
        lastIdx = m.index + m.value.length;
      });
      html += escapeHtml(testString.slice(lastIdx));

      return { matches: matchArr, error: null, highlightedHtml: html };
    } catch (err) {
      return { matches: [], error: err.message, highlightedHtml: '' };
    }
  }, [pattern, flags, testString]);

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Regex Tester",
    "description": "Free online regex tester with real-time match highlighting, capture groups, and flag controls.",
    "url": "https://www.progrmrslife.com/tools/regex-tester",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  };

  return (
    <ToolLayout toolSlug="regex-tester" schemaMarkup={schemaMarkup}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Regex Tester
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test regular expressions in real-time with match highlighting and capture group display.
          </p>
        </div>

        {/* Pattern Input */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Pattern
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-lg">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern…"
              className="tool-editor flex-1 py-2"
              style={{ minHeight: 'auto', resize: 'none' }}
              spellCheck={false}
            />
            <span className="text-gray-400 text-lg">/{flags}</span>
          </div>

          {/* Flags */}
          <div className="flex flex-wrap gap-2">
            {flagOptions.map(({ flag, label }) => (
              <button
                key={flag}
                onClick={() => toggleFlag(flag)}
                type="button"
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  flags.includes(flag)
                    ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 ring-1 ring-violet-300 dark:ring-violet-700'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {flag} — {label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="tool-badge tool-badge-error">{error}</div>
        )}

        {/* Test String */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 block">
            Test String
          </label>
          <textarea
            className="tool-editor"
            style={{ minHeight: '150px' }}
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Enter text to test against..."
            spellCheck={false}
          />
        </div>

        {/* Highlighted Output */}
        {testString && pattern && !error && (
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 block">
              Match Highlighting
            </label>
            <div
              className="tool-output"
              style={{ minHeight: '100px' }}
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          </div>
        )}

        {/* Match Results */}
        {matches.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Matches
              </span>
              <span className="tool-badge tool-badge-success">
                {matches.length} match{matches.length !== 1 ? 'es' : ''}
              </span>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {matches.map((m, i) => (
                <div key={i} className="tool-glass p-3 text-sm">
                  <div className="flex items-start gap-4">
                    <span className="text-xs font-mono text-gray-400 mt-0.5">#{i + 1}</span>
                    <div className="flex-1">
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white">&quot;{m.value}&quot;</span>
                        <span className="text-xs text-gray-400 ml-2">at index {m.index}</span>
                      </div>
                      {m.groups.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {m.groups.map((g, gi) => (
                            <span key={gi} className="tool-badge tool-badge-info text-xs">
                              Group {gi + 1}: &quot;{g}&quot;
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {testString && pattern && !error && matches.length === 0 && (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500">
            <span className="text-3xl mb-2 block">🔍</span>
            No matches found
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

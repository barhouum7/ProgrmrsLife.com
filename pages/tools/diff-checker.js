import React, { useState, useMemo } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';

export default function DiffChecker() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');

  const diff = useMemo(() => {
    if (!left && !right) return null;

    const leftLines = left.split('\n');
    const rightLines = right.split('\n');
    const maxLen = Math.max(leftLines.length, rightLines.length);
    const result = [];

    // Simple line-by-line comparison
    for (let i = 0; i < maxLen; i++) {
      const l = leftLines[i];
      const r = rightLines[i];

      if (l === undefined) {
        result.push({ type: 'added', lineLeft: null, lineRight: i + 1, left: '', right: r });
      } else if (r === undefined) {
        result.push({ type: 'removed', lineLeft: i + 1, lineRight: null, left: l, right: '' });
      } else if (l === r) {
        result.push({ type: 'same', lineLeft: i + 1, lineRight: i + 1, left: l, right: r });
      } else {
        result.push({ type: 'changed', lineLeft: i + 1, lineRight: i + 1, left: l, right: r });
      }
    }

    const stats = {
      added: result.filter((r) => r.type === 'added').length,
      removed: result.filter((r) => r.type === 'removed').length,
      changed: result.filter((r) => r.type === 'changed').length,
      same: result.filter((r) => r.type === 'same').length,
    };

    return { lines: result, stats };
  }, [left, right]);

  const handleSample = () => {
    setLeft(`function greet(name) {
  console.log("Hello, " + name);
  return true;
}

const users = ["Alice", "Bob"];
users.forEach(greet);`);
    setRight(`function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return true;
}

const users = ["Alice", "Bob", "Charlie"];
users.forEach(greet);
console.log("Done!");`);
  };

  const handleClear = () => {
    setLeft('');
    setRight('');
  };

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Diff Checker",
    "description": "Free online diff checker. Compare two text blocks side by side and visualize additions, deletions, and changes.",
    "url": "https://www.progrmrslife.com/tools/diff-checker",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  };

  return (
    <ToolLayout toolSlug="diff-checker" schemaMarkup={schemaMarkup}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Diff Checker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Compare two blocks of text side by side. Additions, deletions, and changes are highlighted instantly.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={handleSample} className="tool-btn tool-btn-secondary" type="button">
            <span>📋</span> Load Sample
          </button>
          <button onClick={handleClear} className="tool-btn tool-btn-danger" type="button">
            <span>🗑️</span> Clear All
          </button>
        </div>

        {/* Input Panels */}
        <div className="tool-split">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Original Text
            </span>
            <textarea
              className="tool-editor"
              style={{ minHeight: '200px' }}
              value={left}
              onChange={(e) => setLeft(e.target.value)}
              placeholder="Paste original text here…"
              spellCheck={false}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Modified Text
            </span>
            <textarea
              className="tool-editor"
              style={{ minHeight: '200px' }}
              value={right}
              onChange={(e) => setRight(e.target.value)}
              placeholder="Paste modified text here…"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Diff Stats */}
        {diff && (
          <div className="flex flex-wrap gap-3">
            <span className="tool-badge tool-badge-success">
              +{diff.stats.added} added
            </span>
            <span className="tool-badge tool-badge-error">
              -{diff.stats.removed} removed
            </span>
            <span className="tool-badge tool-badge-info">
              ~{diff.stats.changed} changed
            </span>
            <span className="tool-badge" style={{ background: 'rgba(156,163,175,0.15)', color: '#6b7280' }}>
              {diff.stats.same} unchanged
            </span>
          </div>
        )}

        {/* Diff Output */}
        {diff && diff.lines.some((l) => l.type !== 'same') && (
          <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              Diff Output
            </div>
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-xs font-mono">
                <tbody>
                  {diff.lines.map((line, i) => (
                    <tr key={i} className={getDiffRowClass(line.type)}>
                      <td className="px-3 py-1 text-gray-400 dark:text-gray-500 select-none text-right w-10 border-r border-gray-200 dark:border-gray-700">
                        {line.lineLeft || ''}
                      </td>
                      <td className="px-3 py-1 text-gray-400 dark:text-gray-500 select-none text-right w-10 border-r border-gray-200 dark:border-gray-700">
                        {line.lineRight || ''}
                      </td>
                      <td className="px-2 py-1 select-none w-6 text-center font-bold">
                        {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : line.type === 'changed' ? '~' : ' '}
                      </td>
                      <td className="px-3 py-1 whitespace-pre">
                        {line.type === 'removed' || line.type === 'same' ? line.left : ''}
                        {line.type === 'added' ? line.right : ''}
                        {line.type === 'changed' ? (
                          <>
                            <span className="line-through opacity-60">{line.left}</span>
                            <span className="mx-2 text-gray-400">→</span>
                            <span className="font-semibold">{line.right}</span>
                          </>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {diff && diff.lines.every((l) => l.type === 'same') && left && right && (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500">
            <span className="text-3xl mb-2 block">✅</span>
            Both texts are identical!
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

function getDiffRowClass(type) {
  switch (type) {
    case 'added': return 'diff-added';
    case 'removed': return 'diff-removed';
    case 'changed': return 'bg-amber-50/50 dark:bg-amber-900/10 border-l-3 border-amber-400';
    default: return '';
  }
}

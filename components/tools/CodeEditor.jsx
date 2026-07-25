import React, { useRef, useCallback } from 'react';
import { useTheme } from 'next-themes';
import toast from 'react-hot-toast';

/**
 * Reusable code editor panel with copy, clear, and download actions.
 * Works seamlessly with next-themes dark/light mode.
 */
const CodeEditor = ({
  value,
  onChange,
  placeholder = 'Paste or type here…',
  readOnly = false,
  language = 'text',
  label,
  maxHeight = '500px',
  minHeight = '220px',
  showActions = true,
  downloadFilename,
}) => {
  const textareaRef = useRef(null);
  const { resolvedTheme } = useTheme();

  const handleCopy = useCallback(async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      toast.success('Copied to clipboard!', { duration: 2000 });
    } catch {
      toast.error('Failed to copy');
    }
  }, [value]);

  const handleClear = useCallback(() => {
    if (onChange) onChange('');
    if (textareaRef.current) textareaRef.current.focus();
  }, [onChange]);

  const handleDownload = useCallback(() => {
    if (!value) return;
    const ext = {
      json: 'json', css: 'css', js: 'js', html: 'html',
      markdown: 'md', text: 'txt', xml: 'xml',
    }[language] || 'txt';
    const filename = downloadFilename || `output.${ext}`;
    const blob = new Blob([value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`, { duration: 2000 });
  }, [value, language, downloadFilename]);

  return (
    <div className="flex flex-col gap-2">
      {/* Header Row */}
      {(label || showActions) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {label}
            </span>
          )}
          {showActions && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                disabled={!value}
                className="tool-btn tool-btn-secondary text-xs py-1 px-2 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Copy to clipboard"
                type="button"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
              {!readOnly && (
                <button
                  onClick={handleClear}
                  disabled={!value}
                  className="tool-btn tool-btn-danger text-xs py-1 px-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Clear"
                  type="button"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear
                </button>
              )}
              <button
                onClick={handleDownload}
                disabled={!value}
                className="tool-btn tool-btn-secondary text-xs py-1 px-2 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Download file"
                type="button"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
            </div>
          )}
        </div>
      )}

      {/* Textarea / Output */}
      {readOnly ? (
        <div
          className="tool-output"
          style={{ minHeight, maxHeight }}
        >
          {value || <span className="text-gray-400 dark:text-gray-500 italic">Output will appear here…</span>}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          className="tool-editor"
          style={{ minHeight, maxHeight }}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      )}
    </div>
  );
};

export default CodeEditor;

import React, { useState, useCallback } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';
import CodeEditor from '../../components/tools/CodeEditor';

export default function UrlEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');
  const [status, setStatus] = useState(null);
  const [encodeType, setEncodeType] = useState('component'); // 'component' | 'full'

  const handleProcess = useCallback(() => {
    if (!input.trim()) { setStatus({ type: 'error', message: 'Please enter some text' }); return; }
    try {
      let result;
      if (mode === 'encode') {
        result = encodeType === 'component' ? encodeURIComponent(input) : encodeURI(input);
      } else {
        result = encodeType === 'component' ? decodeURIComponent(input) : decodeURI(input);
      }
      setOutput(result);
      setStatus({ type: 'success', message: `${mode === 'encode' ? 'Encoded' : 'Decoded'} successfully!` });
    } catch (err) {
      setOutput('');
      setStatus({ type: 'error', message: `Error: ${err.message}` });
    }
  }, [input, mode, encodeType]);

  const handleSwap = useCallback(() => {
    setInput(output);
    setOutput('');
    setMode((prev) => (prev === 'encode' ? 'decode' : 'encode'));
    setStatus(null);
  }, [output]);

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "URL Encoder / Decoder",
    "description": "Free online URL encoder and decoder. Encode or decode URLs and query strings safely.",
    "url": "https://www.progrmrslife.com/tools/url-encoder",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  };

  return (
    <ToolLayout toolSlug="url-encoder" schemaMarkup={schemaMarkup}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            URL Encoder / Decoder
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Encode or decode URLs and query parameters. Handles special characters and Unicode safely.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
            <button
              onClick={() => { setMode('encode'); setStatus(null); }}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                mode === 'encode' ? 'bg-violet-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
              type="button"
            >
              Encode
            </button>
            <button
              onClick={() => { setMode('decode'); setStatus(null); }}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                mode === 'decode' ? 'bg-violet-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
              type="button"
            >
              Decode
            </button>
          </div>

          <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
            <button
              onClick={() => setEncodeType('component')}
              className={`px-3 py-2 text-xs font-medium transition-colors ${
                encodeType === 'component' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
              type="button"
              title="encodeURIComponent — encodes everything including : / ? # etc."
            >
              Component
            </button>
            <button
              onClick={() => setEncodeType('full')}
              className={`px-3 py-2 text-xs font-medium transition-colors ${
                encodeType === 'full' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
              type="button"
              title="encodeURI — preserves URL structure characters"
            >
              Full URL
            </button>
          </div>

          <button onClick={handleProcess} className="tool-btn tool-btn-primary" type="button">
            <span>{mode === 'encode' ? '🔒' : '🔓'}</span>
            {mode === 'encode' ? 'Encode' : 'Decode'}
          </button>

          <button onClick={handleSwap} disabled={!output} className="tool-btn tool-btn-secondary disabled:opacity-40" type="button">
            <span>⇄</span> Swap
          </button>
        </div>

        <div className="text-xs text-gray-400 dark:text-gray-500">
          {encodeType === 'component'
            ? '💡 Component mode: Encodes all special characters (use for query params & values)'
            : '💡 Full URL mode: Preserves URL structure chars like : / ? # (use for complete URLs)'
          }
        </div>

        {status && (
          <div className={`tool-badge ${status.type === 'success' ? 'tool-badge-success' : 'tool-badge-error'}`}>
            {status.message}
          </div>
        )}

        <div className="tool-split">
          <CodeEditor
            value={input}
            onChange={setInput}
            label={mode === 'encode' ? 'Plain Text / URL' : 'Encoded URL'}
            placeholder={mode === 'encode' ? 'Enter URL or text to encode…' : 'Paste encoded URL to decode…'}
            language="text"
          />
          <CodeEditor
            value={output}
            readOnly
            label={mode === 'encode' ? 'Encoded Output' : 'Decoded Output'}
            language="text"
          />
        </div>
      </div>
    </ToolLayout>
  );
}

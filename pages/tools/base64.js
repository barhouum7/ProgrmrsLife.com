import React, { useState, useCallback } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';
import CodeEditor from '../../components/tools/CodeEditor';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode'); // 'encode' | 'decode'
  const [status, setStatus] = useState(null);

  const handleProcess = useCallback(() => {
    if (!input.trim()) { setStatus({ type: 'error', message: 'Please enter some text' }); return; }
    try {
      if (mode === 'encode') {
        // Properly handle UTF-8
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
        setStatus({ type: 'success', message: `Encoded! ${input.length} chars → ${encoded.length} chars` });
      } else {
        const decoded = decodeURIComponent(escape(atob(input.trim())));
        setOutput(decoded);
        setStatus({ type: 'success', message: `Decoded! ${input.length} chars → ${decoded.length} chars` });
      }
    } catch (err) {
      setOutput('');
      setStatus({ type: 'error', message: mode === 'decode' ? 'Invalid Base64 string' : `Error: ${err.message}` });
    }
  }, [input, mode]);

  const handleSwap = useCallback(() => {
    setInput(output);
    setOutput('');
    setMode((prev) => (prev === 'encode' ? 'decode' : 'encode'));
    setStatus(null);
  }, [output]);

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Base64 Encoder / Decoder",
    "description": "Free online Base64 encoder and decoder. Encode text to Base64 or decode Base64 strings with UTF-8 support.",
    "url": "https://www.progrmrslife.com/tools/base64",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  };

  return (
    <ToolLayout toolSlug="base64" schemaMarkup={schemaMarkup}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Base64 Encoder / Decoder
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Encode text to Base64 or decode Base64 strings. Fully supports UTF-8 characters.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
            <button
              onClick={() => { setMode('encode'); setStatus(null); }}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                mode === 'encode'
                  ? 'bg-violet-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              type="button"
            >
              Encode
            </button>
            <button
              onClick={() => { setMode('decode'); setStatus(null); }}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                mode === 'decode'
                  ? 'bg-violet-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              type="button"
            >
              Decode
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

        {status && (
          <div className={`tool-badge ${status.type === 'success' ? 'tool-badge-success' : 'tool-badge-error'}`}>
            {status.message}
          </div>
        )}

        <div className="tool-split">
          <CodeEditor
            value={input}
            onChange={setInput}
            label={mode === 'encode' ? 'Plain Text' : 'Base64 String'}
            placeholder={mode === 'encode' ? 'Enter text to encode…' : 'Paste Base64 string to decode…'}
            language="text"
          />
          <CodeEditor
            value={output}
            readOnly
            label={mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
            language="text"
            downloadFilename={mode === 'encode' ? 'encoded.txt' : 'decoded.txt'}
          />
        </div>
      </div>
    </ToolLayout>
  );
}

import React, { useState, useCallback } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';
import CodeEditor from '../../components/tools/CodeEditor';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const [indentSize, setIndentSize] = useState(2);

  const handleFormat = useCallback(() => {
    if (!input.trim()) { setStatus({ type: 'error', message: 'Please enter some JSON' }); return; }
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutput(formatted);
      setStatus({ type: 'success', message: `Valid JSON — ${Object.keys(parsed).length} top-level keys` });
    } catch (err) {
      setOutput('');
      setStatus({ type: 'error', message: `Invalid JSON: ${err.message}` });
    }
  }, [input, indentSize]);

  const handleMinify = useCallback(() => {
    if (!input.trim()) { setStatus({ type: 'error', message: 'Please enter some JSON' }); return; }
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      const savings = input.length > 0 ? Math.round((1 - minified.length / input.length) * 100) : 0;
      setOutput(minified);
      setStatus({ type: 'success', message: `Minified! ${savings}% smaller (${input.length} → ${minified.length} chars)` });
    } catch (err) {
      setOutput('');
      setStatus({ type: 'error', message: `Invalid JSON: ${err.message}` });
    }
  }, [input]);

  const handleValidate = useCallback(() => {
    if (!input.trim()) { setStatus({ type: 'error', message: 'Please enter some JSON' }); return; }
    try {
      JSON.parse(input);
      setStatus({ type: 'success', message: '✓ Valid JSON' });
    } catch (err) {
      setStatus({ type: 'error', message: `✗ Invalid: ${err.message}` });
    }
  }, [input]);

  const handleSample = useCallback(() => {
    const sample = JSON.stringify({
      name: "ProgrmrsLife",
      version: "2.0",
      tools: ["JSON Formatter", "Base64", "Regex Tester"],
      config: { theme: "dark", language: "en" },
      stats: { users: 40000, posts: 150, tools: 10 }
    }, null, 2);
    setInput(sample);
    setOutput('');
    setStatus(null);
  }, []);

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "JSON Formatter & Validator",
    "description": "Free online JSON formatter, validator, and minifier. Format, validate, and minify JSON data instantly.",
    "url": "https://www.progrmrslife.com/tools/json-formatter",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  };

  return (
    <ToolLayout toolSlug="json-formatter" schemaMarkup={schemaMarkup}>
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            JSON Formatter & Validator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Paste your JSON data below to validate, format with custom indentation, or minify it instantly.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={handleFormat} className="tool-btn tool-btn-primary" type="button">
            <span>✨</span> Format
          </button>
          <button onClick={handleMinify} className="tool-btn tool-btn-primary" type="button">
            <span>📦</span> Minify
          </button>
          <button onClick={handleValidate} className="tool-btn tool-btn-secondary" type="button">
            <span>✓</span> Validate
          </button>
          <button onClick={handleSample} className="tool-btn tool-btn-secondary" type="button">
            <span>📋</span> Sample
          </button>

          {/* Indent Size */}
          <div className="flex items-center gap-2 ml-auto">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400" htmlFor="indent-size">
              Indent:
            </label>
            <select
              id="indent-size"
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 
                         text-gray-900 dark:text-gray-200 px-2 py-1 focus:ring-violet-500 focus:border-violet-500"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={8}>8 spaces</option>
            </select>
          </div>
        </div>

        {/* Status */}
        {status && (
          <div className={`tool-badge ${status.type === 'success' ? 'tool-badge-success' : 'tool-badge-error'}`}>
            {status.message}
          </div>
        )}

        {/* Editor Panels */}
        <div className="tool-split">
          <CodeEditor
            value={input}
            onChange={setInput}
            label="Input"
            placeholder='Paste your JSON here...\n\n{\n  "key": "value"\n}'
            language="json"
          />
          <CodeEditor
            value={output}
            readOnly
            label="Output"
            language="json"
            downloadFilename="formatted.json"
          />
        </div>
      </div>
    </ToolLayout>
  );
}

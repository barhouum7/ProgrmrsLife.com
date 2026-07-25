import React, { useState, useCallback } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';
import CodeEditor from '../../components/tools/CodeEditor';

export default function CssMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('css'); // 'css' | 'js'
  const [status, setStatus] = useState(null);

  const minifyCSS = (css) => {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '')    // Remove comments
      .replace(/\s+/g, ' ')                 // Collapse whitespace
      .replace(/\s*([{}:;,>~+])\s*/g, '$1') // Remove spaces around selectors/properties
      .replace(/;}/g, '}')                  // Remove last semicolons
      .replace(/^\s+|\s+$/g, '')            // Trim
      .trim();
  };

  const prettifyCSS = (css) => {
    let depth = 0;
    let result = '';
    const minified = minifyCSS(css);
    
    for (let i = 0; i < minified.length; i++) {
      const char = minified[i];
      if (char === '{') {
        depth++;
        result += ' {\n' + '  '.repeat(depth);
      } else if (char === '}') {
        depth = Math.max(0, depth - 1);
        result += '\n' + '  '.repeat(depth) + '}\n' + '  '.repeat(depth);
      } else if (char === ';') {
        result += ';\n' + '  '.repeat(depth);
      } else {
        result += char;
      }
    }
    return result.replace(/\n\s*\n/g, '\n').trim();
  };

  const minifyJS = (js) => {
    return js
      .replace(/\/\/.*$/gm, '')             // Single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '')      // Multi-line comments
      .replace(/\s+/g, ' ')                  // Collapse whitespace
      .replace(/\s*([{}();:,=<>!&|+\-*/])\s*/g, '$1')
      .trim();
  };

  const prettifyJS = (js) => {
    let depth = 0;
    let result = '';
    const min = minifyJS(js);
    let inString = false;
    let stringChar = '';

    for (let i = 0; i < min.length; i++) {
      const char = min[i];
      
      if (inString) {
        result += char;
        if (char === stringChar && min[i - 1] !== '\\') inString = false;
        continue;
      }
      
      if (char === '"' || char === "'" || char === '`') {
        inString = true;
        stringChar = char;
        result += char;
      } else if (char === '{') {
        depth++;
        result += ' {\n' + '  '.repeat(depth);
      } else if (char === '}') {
        depth = Math.max(0, depth - 1);
        result += '\n' + '  '.repeat(depth) + '}';
        if (i + 1 < min.length && min[i + 1] !== '}' && min[i + 1] !== ';') {
          result += '\n' + '  '.repeat(depth);
        }
      } else if (char === ';') {
        result += ';\n' + '  '.repeat(depth);
      } else {
        result += char;
      }
    }
    return result.replace(/\n\s*\n/g, '\n').trim();
  };

  const handleMinify = useCallback(() => {
    if (!input.trim()) { setStatus({ type: 'error', message: 'Please enter some code' }); return; }
    const minified = mode === 'css' ? minifyCSS(input) : minifyJS(input);
    const savings = Math.round((1 - minified.length / input.length) * 100);
    setOutput(minified);
    setStatus({
      type: 'success',
      message: `Minified! ${savings}% smaller (${input.length.toLocaleString()} → ${minified.length.toLocaleString()} chars)`
    });
  }, [input, mode]);

  const handlePrettify = useCallback(() => {
    if (!input.trim()) { setStatus({ type: 'error', message: 'Please enter some code' }); return; }
    const pretty = mode === 'css' ? prettifyCSS(input) : prettifyJS(input);
    setOutput(pretty);
    setStatus({ type: 'success', message: 'Formatted!' });
  }, [input, mode]);

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "CSS / JS Minifier & Prettifier",
    "description": "Free online CSS and JavaScript minifier and prettifier with real-time compression stats.",
    "url": "https://www.progrmrslife.com/tools/css-minifier",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  };

  return (
    <ToolLayout toolSlug="css-minifier" schemaMarkup={schemaMarkup}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            CSS / JS Minifier & Prettifier
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Minify or prettify CSS and JavaScript code instantly with compression stats.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
            <button
              onClick={() => { setMode('css'); setStatus(null); }}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                mode === 'css' ? 'bg-violet-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
              type="button"
            >
              CSS
            </button>
            <button
              onClick={() => { setMode('js'); setStatus(null); }}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                mode === 'js' ? 'bg-violet-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
              type="button"
            >
              JavaScript
            </button>
          </div>

          <button onClick={handleMinify} className="tool-btn tool-btn-primary" type="button">
            <span>📦</span> Minify
          </button>
          <button onClick={handlePrettify} className="tool-btn tool-btn-primary" type="button">
            <span>✨</span> Prettify
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
            label="Input"
            placeholder={mode === 'css' ? '.container {\n  display: flex;\n  gap: 1rem;\n}' : 'function hello() {\n  console.log("Hello!");\n}'}
            language={mode}
          />
          <CodeEditor
            value={output}
            readOnly
            label="Output"
            language={mode}
            downloadFilename={`output.${mode === 'css' ? 'css' : 'js'}`}
          />
        </div>
      </div>
    </ToolLayout>
  );
}

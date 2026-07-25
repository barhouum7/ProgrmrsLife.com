import React, { useState, useCallback } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';
import CodeEditor from '../../components/tools/CodeEditor';

const SAMPLE = `{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "isActive": true,
  "roles": ["admin", "user"],
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "zip": "62704"
  },
  "orders": [
    { "id": 1, "product": "Widget", "qty": 3 },
    { "id": 2, "product": "Gadget", "qty": 1 }
  ]
}`;

export default function JsonToTypeScript() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [rootName, setRootName] = useState('Root');
  const [status, setStatus] = useState(null);

  const convert = useCallback(() => {
    if (!input.trim()) {
      setStatus({ type: 'error', message: 'Please enter some JSON' });
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const result = jsonToTS(parsed, rootName || 'Root');
      setOutput(result);
      setStatus({ type: 'success', message: 'Converted successfully!' });
    } catch (err) {
      setOutput('');
      setStatus({ type: 'error', message: `Invalid JSON: ${err.message}` });
    }
  }, [input, rootName]);

  const loadSample = () => {
    setInput(SAMPLE);
    setStatus(null);
  };

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "JSON to TypeScript Converter",
    "description": "Free online tool to convert JSON objects into TypeScript interfaces instantly. Supports nested objects, arrays, and optional fields.",
    "url": "https://www.progrmrslife.com/tools/json-to-typescript",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  };

  return (
    <ToolLayout toolSlug="json-to-typescript" schemaMarkup={schemaMarkup}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            JSON → TypeScript
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Paste any JSON and instantly generate clean TypeScript interfaces. Handles nested objects, arrays, and mixed types.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="rootName" className="text-xs font-medium text-gray-500 dark:text-gray-400">Root interface:</label>
            <input
              id="rootName"
              type="text"
              value={rootName}
              onChange={(e) => setRootName(e.target.value)}
              className="tool-editor px-2 py-1 text-sm"
              style={{ minHeight: 'auto', width: '120px' }}
              placeholder="Root"
            />
          </div>
          <button onClick={convert} className="tool-btn tool-btn-primary" type="button">
            <span>⚡</span> Convert
          </button>
          <button onClick={loadSample} className="tool-btn tool-btn-secondary" type="button">
            <span>📋</span> Load Sample
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
            label="JSON Input"
            placeholder='Paste your JSON here…'
            language="json"
          />
          <CodeEditor
            value={output}
            readOnly
            label="TypeScript Output"
            language="typescript"
          />
        </div>
      </div>
    </ToolLayout>
  );
}

// ── JSON → TS Converter Engine ──────────────────────────────
function jsonToTS(obj, name = 'Root', indent = 0) {
  const interfaces = [];
  const pad = '  '.repeat(indent);

  function getType(value, key) {
    if (value === null || value === undefined) return 'unknown';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return Number.isInteger(value) ? 'number' : 'number';
    if (typeof value === 'boolean') return 'boolean';

    if (Array.isArray(value)) {
      if (value.length === 0) return 'unknown[]';
      const itemTypes = value.map((v, i) => getType(v, key));
      const unique = [...new Set(itemTypes)];

      // If all items are objects, generate a sub-interface
      if (unique.length === 1 && typeof value[0] === 'object' && value[0] !== null && !Array.isArray(value[0])) {
        const subName = capitalize(key) + 'Item';
        generateInterface(value[0], subName);
        return `${subName}[]`;
      }
      if (unique.length === 1) return `${unique[0]}[]`;
      return `(${unique.join(' | ')})[]`;
    }

    if (typeof value === 'object') {
      const subName = capitalize(key);
      generateInterface(value, subName);
      return subName;
    }

    return 'unknown';
  }

  function generateInterface(obj, interfaceName) {
    const lines = [];
    lines.push(`export interface ${interfaceName} {`);

    for (const [key, value] of Object.entries(obj)) {
      const safeName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;
      const type = getType(value, key);
      lines.push(`  ${safeName}: ${type};`);
    }

    lines.push('}');
    interfaces.push(lines.join('\n'));
  }

  generateInterface(obj, name);

  // Reverse so the root interface is first
  return interfaces.reverse().join('\n\n');
}

function capitalize(str) {
  if (!str) return 'Unknown';
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/[^a-zA-Z0-9]/g, '');
}

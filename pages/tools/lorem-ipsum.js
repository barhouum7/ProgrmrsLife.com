import React, { useState, useCallback } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';

export default function LoremIpsumGenerator() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState('paragraphs'); // paragraphs | sentences | words
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const WORDS = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'pellentesque', 'habitant',
    'morbi', 'tristique', 'senectus', 'netus', 'malesuada', 'fames', 'turpis',
    'egestas', 'integer', 'felis', 'blandit', 'proin', 'viverra', 'faucibus',
    'interdum', 'posuere', 'lacinia', 'nisl', 'augue', 'ultricies', 'leo',
    'massa', 'placerat', 'duis', 'risus', 'pretium', 'quam', 'vulputate',
    'dignissim', 'suspendisse', 'potenti', 'nullam', 'ac', 'tortor', 'vitae',
    'purus', 'faucibus', 'ornare', 'cursus', 'nunc', 'congue', 'nisi',
  ];

  const randomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];
  const randomSentence = () => {
    const len = 8 + Math.floor(Math.random() * 12);
    const words = Array.from({ length: len }, randomWord);
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(' ') + '.';
  };
  const randomParagraph = () => {
    const len = 4 + Math.floor(Math.random() * 4);
    return Array.from({ length: len }, randomSentence).join(' ');
  };

  const generate = useCallback(() => {
    let result = '';
    const n = Math.max(1, Math.min(count, 100));

    if (unit === 'words') {
      result = Array.from({ length: n }, randomWord).join(' ');
      result = result.charAt(0).toUpperCase() + result.slice(1);
    } else if (unit === 'sentences') {
      result = Array.from({ length: n }, randomSentence).join(' ');
    } else {
      result = Array.from({ length: n }, randomParagraph).join('\n\n');
    }
    setOutput(result);
  }, [count, unit]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  const wordCount = output ? output.split(/\s+/).filter(Boolean).length : 0;
  const charCount = output.length;

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Lorem Ipsum Generator",
    "description": "Free online Lorem Ipsum placeholder text generator. Generate paragraphs, sentences, or words of dummy text for design and development.",
    "url": "https://www.progrmrslife.com/tools/lorem-ipsum",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  };

  return (
    <ToolLayout toolSlug="lorem-ipsum" schemaMarkup={schemaMarkup}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Lorem Ipsum Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate placeholder text for your designs and prototypes. Choose paragraphs, sentences, or words.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="count" className="text-sm font-medium text-gray-600 dark:text-gray-400">Generate</label>
            <input
              id="count"
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="tool-editor px-2 py-1 text-sm text-center"
              style={{ minHeight: 'auto', width: '70px' }}
            />
          </div>

          <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
            {['paragraphs', 'sentences', 'words'].map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors capitalize ${
                  unit === u ? 'bg-violet-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
                type="button"
              >
                {u}
              </button>
            ))}
          </div>

          <button onClick={generate} className="tool-btn tool-btn-primary" type="button">
            <span>✨</span> Generate
          </button>
        </div>

        {output && (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <span className="tool-badge tool-badge-info">{wordCount} words</span>
              <span className="tool-badge">{charCount} characters</span>
              <button onClick={handleCopy} className="tool-btn tool-btn-secondary text-sm" type="button">
                {copied ? '✓ Copied!' : '📋 Copy All'}
              </button>
            </div>

            <div className="tool-output whitespace-pre-wrap text-sm leading-relaxed">
              {output}
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}

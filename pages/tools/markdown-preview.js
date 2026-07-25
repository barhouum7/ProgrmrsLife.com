import React, { useState, useMemo } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';
import CodeEditor from '../../components/tools/CodeEditor';

// Simple markdown parser (no external dependencies)
function parseMarkdown(md) {
  let html = md;

  // Code blocks (fenced)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre class="tool-output" style="min-height:auto;margin:0.75rem 0"><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code style="background:rgba(139,92,246,0.1);padding:0.125rem 0.375rem;border-radius:0.25rem;font-size:0.875em">$1</code>');

  // Headers
  html = html.replace(/^######\s(.+)$/gm, '<h6 style="font-size:0.875rem;font-weight:700;margin:0.75rem 0 0.25rem">$1</h6>');
  html = html.replace(/^#####\s(.+)$/gm, '<h5 style="font-size:1rem;font-weight:700;margin:0.75rem 0 0.25rem">$1</h5>');
  html = html.replace(/^####\s(.+)$/gm, '<h4 style="font-size:1.125rem;font-weight:700;margin:1rem 0 0.5rem">$1</h4>');
  html = html.replace(/^###\s(.+)$/gm, '<h3 style="font-size:1.25rem;font-weight:700;margin:1rem 0 0.5rem">$1</h3>');
  html = html.replace(/^##\s(.+)$/gm, '<h2 style="font-size:1.5rem;font-weight:700;margin:1.25rem 0 0.5rem">$1</h2>');
  html = html.replace(/^#\s(.+)$/gm, '<h1 style="font-size:2rem;font-weight:800;margin:1.5rem 0 0.75rem">$1</h1>');

  // Bold & Italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

  // Links & images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:0.5rem;margin:0.5rem 0" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#8b5cf6;text-decoration:underline" target="_blank" rel="noopener">$1</a>');

  // Blockquotes
  html = html.replace(/^>\s(.+)$/gm, '<blockquote style="border-left:3px solid #8b5cf6;padding-left:1rem;margin:0.75rem 0;color:#6b7280;font-style:italic">$1</blockquote>');

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr style="border:none;border-top:1px solid rgba(156,163,175,0.3);margin:1.5rem 0" />');

  // Unordered lists
  html = html.replace(/^[\*\-]\s(.+)$/gm, '<li style="margin-left:1.5rem;list-style:disc">$1</li>');

  // Ordered lists
  html = html.replace(/^\d+\.\s(.+)$/gm, '<li style="margin-left:1.5rem;list-style:decimal">$1</li>');

  // Tables (GFM-style)
  html = html.replace(/^\|(.+)\|$/gm, (match) => {
    const cells = match.split('|').filter(c => c.trim()).map(c => c.trim());
    if (cells.every(c => /^[-:]+$/.test(c))) return '<tr class="table-divider"></tr>';
    const tag = cells.map(c => `<td style="padding:0.5rem 0.75rem;border:1px solid rgba(156,163,175,0.2)">${c}</td>`).join('');
    return `<tr>${tag}</tr>`;
  });
  html = html.replace(/(<tr>[\s\S]*?<\/tr>\s*)+/g, (match) => {
    const cleaned = match.replace(/<tr class="table-divider"><\/tr>/g, '');
    return `<table style="width:100%;border-collapse:collapse;margin:0.75rem 0;font-size:0.875rem">${cleaned}</table>`;
  });

  // Paragraphs - wrap remaining lines
  html = html.replace(/^(?!<[a-z])((?!^\s*$).+)$/gm, '<p style="margin:0.5rem 0;line-height:1.7">$1</p>');

  // Clean up double paragraphs
  html = html.replace(/<\/p>\s*<p/g, '</p>\n<p');

  return html;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export default function MarkdownPreview() {
  const [input, setInput] = useState(`# Hello World! 👋

This is a **live Markdown preview** tool by _ProgrmrsLife_.

## Features
- **Bold** and *italic* text
- [Links](https://progrmrslife.com)
- ~~Strikethrough~~
- Code blocks and \`inline code\`

### Code Example
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

> "The best way to predict the future is to create it." — Abraham Lincoln

---

| Feature | Status |
| ------- | ------ |
| Headers | ✅ |
| Lists   | ✅ |
| Tables  | ✅ |
`);

  const rendered = useMemo(() => parseMarkdown(input), [input]);

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Markdown Preview",
    "description": "Free online Markdown editor with live preview. Supports GFM tables, code blocks, and formatting.",
    "url": "https://www.progrmrslife.com/tools/markdown-preview",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  };

  return (
    <ToolLayout toolSlug="markdown-preview" schemaMarkup={schemaMarkup}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Markdown Preview
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Write Markdown on the left, see the rendered output on the right in real-time.
          </p>
        </div>

        <div className="tool-split">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Markdown Input
            </span>
            <textarea
              className="tool-editor"
              style={{ minHeight: '400px' }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write your Markdown here..."
              spellCheck={false}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Preview
            </span>
            <div
              className="tool-output prose dark:prose-invert max-w-none"
              style={{ minHeight: '400px' }}
              dangerouslySetInnerHTML={{ __html: rendered }}
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

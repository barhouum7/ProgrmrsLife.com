import React from 'react';

/**
 * Numbered step card for how-to guide articles.
 * Displays step title, content, and optional code snippet with copy button.
 */
const StepCard = ({ step, index }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (!step.codeSnippet) return;
    try {
      await navigator.clipboard.writeText(step.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <div className="relative pl-12 pb-8 last:pb-0">
      {/* Connector Line */}
      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 to-transparent last:hidden" />

      {/* Step Number */}
      <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 
                      flex items-center justify-center text-white text-sm font-bold shadow-md shadow-violet-500/25">
        {index + 1}
      </div>

      {/* Content */}
      <div className="tool-glass p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {step.stepTitle || step.title || `Step ${index + 1}`}
        </h3>

        {(step.stepContent || step.content) && (
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            {step.stepContent || step.content}
          </p>
        )}

        {/* Code Snippet */}
        {step.codeSnippet && (
          <div className="relative group">
            <button
              onClick={handleCopy}
              type="button"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity
                         tool-btn tool-btn-secondary text-xs py-0.5 px-2 z-10"
            >
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
            <pre className="tool-output text-xs overflow-x-auto" style={{ minHeight: 'auto', maxHeight: '300px' }}>
              <code>{step.codeSnippet}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepCard;

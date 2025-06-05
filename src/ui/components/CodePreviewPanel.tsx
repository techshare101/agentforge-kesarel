import { useState } from 'react';

interface CodePreviewPanelProps {
  code: string;
}

export default function CodePreviewPanel({ code }: CodePreviewPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  if (!code) return null;

  return (
    <div className="bg-[#1c2a40] rounded-lg p-4 mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-400">Generated Code</h3>
        <button
          onClick={handleCopy}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {copied ? '✓ Copied!' : '📋 Copy Code'}
        </button>
      </div>
      <div className="relative">
        <pre className="bg-[#2e3e56] rounded p-4 overflow-x-auto">
          <code className="text-sm font-mono text-gray-200 whitespace-pre">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}

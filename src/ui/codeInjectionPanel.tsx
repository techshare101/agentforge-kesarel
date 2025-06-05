import { useState, useEffect } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getRecentCommands, CommandMemory } from '../memory/supabaseClient';

SyntaxHighlighter.registerLanguage('jsx', jsx);

interface CodeInjectionPanelProps {
  onInject?: (code: string) => void;
  onEdit?: (code: string) => void;
}

export default function CodeInjectionPanel({ onInject, onEdit }: CodeInjectionPanelProps) {
  const [recentCode, setRecentCode] = useState<CommandMemory[]>([]);
  const [selectedCode, setSelectedCode] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editableCode, setEditableCode] = useState('');

  useEffect(() => {
    loadRecentCode();
  }, []);

  async function loadRecentCode() {
    const commands = await getRecentCommands(5);
    setRecentCode(commands.filter(cmd => cmd.code));
  }

  const handleInject = () => {
    if (selectedCode && onInject) {
      onInject(selectedCode);
    }
  };

  const handleEdit = () => {
    if (selectedCode) {
      setIsEditing(true);
      setEditableCode(selectedCode);
    }
  };

  const handleSaveEdit = () => {
    if (onEdit) {
      onEdit(editableCode);
    }
    setIsEditing(false);
    setSelectedCode(editableCode);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(selectedCode);
      // Show success toast or feedback
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="bg-[#1c2a40] rounded-lg p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Code Injection Panel</h2>
        <div className="space-x-3">
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
          >
            📋 Copy
          </button>
          <button
            onClick={handleEdit}
            disabled={!selectedCode}
            className={`px-3 py-1 rounded ${
              selectedCode
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            ✏️ Edit
          </button>
          <button
            onClick={handleInject}
            disabled={!selectedCode}
            className={`px-3 py-1 rounded ${
              selectedCode
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            💉 Inject
          </button>
        </div>
      </div>

      {/* Code Editor/Viewer */}
      <div className="bg-[#2e3e56] rounded-lg p-4">
        {isEditing ? (
          <div className="space-y-4">
            <textarea
              value={editableCode}
              onChange={(e) => setEditableCode(e.target.value)}
              className="w-full h-64 bg-[#1a2234] text-gray-200 p-4 rounded font-mono text-sm"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <SyntaxHighlighter
            language="jsx"
            style={atomDark}
            customStyle={{
              margin: 0,
              borderRadius: '0.375rem',
              maxHeight: '400px',
            }}
          >
            {selectedCode || '// Select code from history below'}
          </SyntaxHighlighter>
        )}
      </div>

      {/* Recent Code History */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-400">Recent Code</h3>
        <div className="space-y-2">
          {recentCode.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCode(item.code || '')}
              className={`w-full text-left p-3 rounded transition-colors ${
                item.code === selectedCode
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#2e3e56] text-gray-300 hover:bg-[#374761]'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{item.command}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
                <span className="text-xs bg-[#1a2234] px-2 py-1 rounded">
                  {item.code?.split('\n').length} lines
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

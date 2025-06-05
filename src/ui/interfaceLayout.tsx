import { useState, useEffect } from 'react';
import { loadVoiceParser, startVoiceParser, stopVoiceParser } from '../core/voiceParser';
import { executeTaskFromCommand } from '../core/taskRouter';
import CodePreviewPanel from './components/CodePreviewPanel';

interface CommandLogEntry {
  command: string;
  timestamp: number;
  result?: string;
  code?: string;
}

const InterfaceLayout = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('Waiting for voice input...');
  const [log, setLog] = useState<CommandLogEntry[]>([]);
  const [currentResult, setCurrentResult] = useState<string>('');
  const [currentCode, setCurrentCode] = useState<string>('');

  useEffect(() => {
    // Initialize voice parser with command handler
    loadVoiceParser(async (command) => {
      setTranscript(command);
      const taskResult = await executeTaskFromCommand(command);
      setCurrentResult(taskResult.message);
      
      // Handle code preview if present
      if (taskResult.data?.type === 'ui' || taskResult.data?.type === 'code') {
        const code = typeof taskResult.data.code === 'string' 
          ? taskResult.data.code 
          : JSON.stringify(taskResult.data.code, null, 2);
        setCurrentCode(code);
      } else {
        setCurrentCode('');
      }
      
      // Add to command log
      setLog(prev => [{
        command,
        timestamp: Date.now(),
        result: taskResult.message,
        code: currentCode
      }, ...prev.slice(0, 4)]); // Keep last 5 commands
    });
  }, []);

  const handleVoiceStart = () => {
    setIsListening(true);
    startVoiceParser();
    setTranscript('Listening...');
  };

  const handleVoiceStop = () => {
    setIsListening(false);
    stopVoiceParser();
    setTranscript('Voice input stopped.');
  };

  return (
    <div className="min-h-screen bg-[#0e1628] text-white p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">AgentForge Kesarel</h1>
        <p className="text-gray-400">Your Ethical AGI Assistant</p>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-[#1c2a40] rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Voice Command Console</h2>
            <div className="space-x-4">
              <button
                onClick={handleVoiceStart}
                disabled={isListening}
                className={`px-4 py-2 rounded-md font-medium ${
                  isListening
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isListening ? '🎤 Recording...' : '🎤 Start Recording'}
              </button>
              <button
                onClick={handleVoiceStop}
                disabled={!isListening}
                className={`px-4 py-2 rounded-md font-medium ${
                  !isListening
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                🛑 Stop Recording
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Live Transcript */}
            <div className="bg-[#2e3e56] rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Live Transcript</h3>
              <div className="whitespace-pre-wrap">{transcript}</div>
            </div>

            {/* Current Result */}
            {currentResult && (
              <div className="bg-[#2e3e56] rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Agent Response</h3>
                <div className="whitespace-pre-wrap">{currentResult}</div>
                {currentCode && <CodePreviewPanel code={currentCode} />}
              </div>
            )}

            {/* Command History */}
            <div className="bg-[#2e3e56] rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Recent Commands</h3>
              <ul className="space-y-2">
                {log.map((entry, idx) => (
                  <li key={idx} className="bg-[#334155] rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 w-full">
                        <p className="font-medium">{entry.command}</p>
                        {entry.result && (
                          <p className="text-sm text-gray-400">{entry.result}</p>
                        )}
                        {entry.code && <CodePreviewPanel code={entry.code} />}
                      </div>
                      <span className="text-xs text-gray-500 ml-4 shrink-0">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterfaceLayout;

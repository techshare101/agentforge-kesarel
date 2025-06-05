import { useState, useEffect } from 'react';
import { loadVoiceParser, startVoiceParser, stopVoiceParser } from '../core/voiceParser';
import { routeCommand } from '../core/taskRouter';
import CodePreviewPanel from './components/CodePreviewPanel';
import CodeInjectionPanel from './codeInjectionPanel';
// import { logCommand, getRecentCommands } from '../memory/supabaseClient';

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
  const [lastInjection, setLastInjection] = useState<{code: string, target: string} | null>(null);
  const [deploymentStatus, setDeploymentStatus] = useState<string>('');
  const [undoEnabled, setUndoEnabled] = useState(false);
  const [devSyncEnabled, setDevSyncEnabled] = useState(false);
  const [showMemoryTimeline, setShowMemoryTimeline] = useState(false);

  useEffect(() => {
    // Initialize voice parser with command handler
    loadVoiceParser(async (command) => {
      setTranscript(command);
      const taskResult = routeCommand(command);
      setCurrentResult(taskResult.message);
      
      // Handle code preview if present
      if (taskResult.data?.type === 'ui' || taskResult.data?.type === 'code') {
        const code = typeof taskResult.data.code === 'string' 
          ? taskResult.data.code 
          : JSON.stringify(taskResult.data.code, null, 2);
        setCurrentCode(code);

        // Log command with code to Supabase
        // await logCommand(command, taskResult.message, code);
      } else if (taskResult.data?.type === 'deployment') {
        setDeploymentStatus(taskResult.data.status);
      } else if (taskResult.data?.type === 'memory' && taskResult.data.action === 'view_timeline') {
        setShowMemoryTimeline(true);
      } else if (taskResult.data?.type === 'feature') {
        if (taskResult.data.action === 'enable_undo') {
          setUndoEnabled(true);
        } else if (taskResult.data.action === 'enable_dev_sync') {
          setDevSyncEnabled(true);
        }
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

    // Load initial command history
    // loadCommandHistory();
  }, []);

  // const loadCommandHistory = async () => {
  //   const history = await getRecentCommands(5);
  //   setLog(history.map(h => ({
  //     command: h.command,
  //     timestamp: new Date(h.timestamp).getTime(),
  //     result: h.result,
  //     code: h.code
  //   })));
  // };

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

  const handleInject = (code: string, target: string) => {
    setCurrentCode(code);
    setLastInjection({ code, target });
  };

  const handleUndo = () => {
    if (lastInjection) {
      setCurrentCode('');
      setLastInjection(null);
    }
  };

  const handleCodeEdit = async (code: string) => {
    setCurrentCode(code);
    // await logCommand('edit_code', 'Code updated successfully', code);
  };

  return (
    <div className="min-h-screen bg-[#0e1628] text-white p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">AgentForge Kesarel</h1>
        <p className="text-gray-400">Your Ethical AGI Assistant</p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Developer Features */}
        {(undoEnabled || devSyncEnabled || showMemoryTimeline) && (
          <div className="lg:col-span-2 bg-[#1c2a40] rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-4">
              {undoEnabled && (
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
                  ⏪ Undo Enabled
                </span>
              )}
              {devSyncEnabled && (
                <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">
                  🔄 Dev Sync Active
                </span>
              )}
              {showMemoryTimeline && (
                <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm">
                  🕒 Memory Timeline
                </span>
              )}
            </div>
          </div>
        )}

        {/* Left Column - Voice Commands */}
        <div className="space-y-6">
          <div className="bg-[#1c2a40] rounded-lg p-6">
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

              {/* Deployment Status */}
              {deploymentStatus && (
                <div className="bg-[#2e3e56] rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Deployment Status</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${deploymentStatus === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <span className="capitalize">{deploymentStatus}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Command History */}
          <div className="bg-[#1c2a40] rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Commands</h3>
            <ul className="space-y-4">
              {log.map((entry, idx) => (
                <li key={idx} className="bg-[#2e3e56] rounded-lg p-4">
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

        {/* Right Column - Code Injection */}
        <div>
          <CodeInjectionPanel 
            onInject={handleInject} 
            onEdit={handleCodeEdit}
            onUndo={handleUndo}
            canUndo={lastInjection !== null}
          />
        </div>
      </main>
    </div>
  );
};

export default InterfaceLayout;

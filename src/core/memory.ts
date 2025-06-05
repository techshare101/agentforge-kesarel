import { AgentMemory } from '../types/agent';

interface CommandLog {
  timestamp: number;
  command: string;
  result?: string;
}

class MemorySystem {
  private memory: AgentMemory = {
    shortTerm: [],
    longTerm: [],
    values: [
      "Serve the voiceless",
      "Act with values",
      "Protect the vulnerable",
      "Empower through knowledge"
    ]
  };

  private commandHistory: CommandLog[] = [];

  constructor() {
    console.log("💭 Initializing memory system...");
  }

  public async initialize() {
    // TODO: Connect to Supabase or Zep for persistent storage
    return true;
  }

  public getValues(): string[] {
    return this.memory.values;
  }

  public async remember(memory: any) {
    this.memory.shortTerm.push(memory);
    // TODO: Implement memory consolidation
  }

  public async recall(query: string): Promise<any[]> {
    // Basic search implementation
    return this.memory.shortTerm.filter(item =>
      JSON.stringify(item).toLowerCase().includes(query.toLowerCase())
    );
  }

  public logCommand(command: string, result?: string) {
    const log: CommandLog = {
      timestamp: Date.now(),
      command,
      result
    };
    this.commandHistory.push(log);
    console.log("📝 Command logged:", command);
    return log;
  }

  public getCommandHistory(): CommandLog[] {
    return this.commandHistory;
  }
}

let memorySystem: MemorySystem | null = null;

export const loadMemory = async () => {
  if (!memorySystem) {
    memorySystem = new MemorySystem();
    await memorySystem.initialize();
  }
  return memorySystem;
};

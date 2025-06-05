export interface AgentState {
  isRunning: boolean;
  currentTask: string | null;
  ethicsEnabled: boolean;
  memoryLoaded: boolean;
}

export interface AgentMemory {
  shortTerm: any[];
  longTerm: any[];
  values: string[];
}

export interface VoiceCommand {
  transcript: string;
  confidence: number;
  timestamp: number;
}

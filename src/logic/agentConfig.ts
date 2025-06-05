export interface AgentConfig {
  name: string;
  version: string;
  capabilities: string[];
  allowedTasks: string[];
  ethicalPrinciples: string[];
}

export const defaultConfig: AgentConfig = {
  name: 'Kesarel',
  version: '1.0.0',
  capabilities: [
    'voice_commands',
    'code_generation',
    'deployment',
    'memory_persistence',
  ],
  allowedTasks: [
    'create_component',
    'modify_code',
    'deploy_staging',
    'query_memory',
  ],
  ethicalPrinciples: [
    'Protect user privacy and data',
    'Ensure transparency in operations',
    'Maintain system integrity',
    'Prevent harmful actions',
    'Empower users through education',
  ],
};

export function updateAgentConfig(updates: Partial<AgentConfig>): AgentConfig {
  return {
    ...defaultConfig,
    ...updates,
  };
}

export function validateTask(task: string): boolean {
  return defaultConfig.allowedTasks.includes(task.toLowerCase());
}

export function getCapabilities(): string[] {
  return defaultConfig.capabilities;
}

export function getEthicalPrinciples(): string[] {
  return defaultConfig.ethicalPrinciples;
}

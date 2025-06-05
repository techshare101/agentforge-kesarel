// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseKey) {
//   throw new Error('Missing Supabase environment variables');
// }

// export const supabase = createClient(supabaseUrl, supabaseKey);

export interface CommandMemory {
  command: string;
  timestamp: string;
  result?: string;
  code?: string;
}

// Mock functions that will be replaced with Supabase later
export async function logCommand(
  command: string,
  result?: string,
  code?: string
): Promise<void> {
  console.log('Mock logCommand:', { command, result, code });
}

export async function getRecentCommands(limit: number = 10): Promise<CommandMemory[]> {
  console.log('Mock getRecentCommands, limit:', limit);
  return [
    {
      command: 'Example command',
      timestamp: new Date().toISOString(),
      result: 'Example result',
      code: '<div>Example code</div>'
    }
  ];
}

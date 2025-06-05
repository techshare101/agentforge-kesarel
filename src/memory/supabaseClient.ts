import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface CommandMemory {
  id: string;
  command: string;
  result: string;
  code?: string;
  timestamp: string;
}

export async function logCommand(command: string, result: string, code?: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('command_history')
      .insert([
        {
          command,
          result,
          code,
          timestamp: new Date().toISOString(),
        },
      ]);

    if (error) throw error;
  } catch (error) {
    console.error('Error logging command:', error);
  }
}

export async function getRecentCommands(limit: number = 10): Promise<CommandMemory[]> {
  try {
    const { data, error } = await supabase
      .from('command_history')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recent commands:', error);
    return [];
  }
}

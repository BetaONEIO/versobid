import { SupabaseClient } from '@supabase/supabase-js';

export async function checkRecentLogs(supabase: SupabaseClient): Promise<void> {
  console.log('4. Checking Recent Email Logs');
  
  try {
    const { data: logs, error } = await supabase
      .from('email_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    console.log('✓ Found recent logs:');
    if (logs && logs.length > 0) {
      logs.forEach(log => {
        console.log(`  - ${log.recipient} (${log.status}) - ${new Date(log.created_at).toLocaleString()}`);
      });
    } else {
      console.log('  No recent logs found');
    }
    console.log('');
  } catch (error) {
    console.error('✗ Failed to fetch recent logs:', error);
    throw error;
  }
}
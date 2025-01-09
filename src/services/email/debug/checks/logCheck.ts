import { SupabaseClient } from '@supabase/supabase-js';

export async function checkEmailLogCreation(supabase: SupabaseClient): Promise<void> {
  console.log('2. Testing Email Log Creation');
  
  try {
    const { data, error } = await supabase
      .from('email_logs')
      .insert({
        recipient: 'test@example.com',
        subject: 'Debug Test Email',
        template_name: 'test',
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    console.log('✓ Test log created successfully');
    console.log(`  Log ID: ${data.id}\n`);
  } catch (error) {
    console.error('✗ Failed to create test log:', error);
    throw error;
  }
}
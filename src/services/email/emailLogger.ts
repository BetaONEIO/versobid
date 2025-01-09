import { supabase } from '../../lib/supabase';
import { CreateEmailLogParams, EmailLog } from './types/emailLog';

export class EmailLogger {
  async createLog(params: CreateEmailLogParams): Promise<EmailLog> {
    console.log('Creating email log:', params);
    
    try {
      const { data, error } = await supabase
        .from('email_logs')
        .insert([{
          recipient: params.recipient,
          subject: params.subject,
          template_name: params.template_name,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) {
        console.error('Failed to create email log:', error);
        throw error;
      }

      console.log('Email log created:', data);
      return data;
    } catch (error) {
      console.error('Error in createLog:', error);
      throw error;
    }
  }

  async updateStatus(id: string, status: EmailLog['status'], error?: string): Promise<void> {
    console.log('Updating email log:', { id, status, error });
    
    try {
      const { error: updateError } = await supabase
        .from('email_logs')
        .update({ 
          status,
          error,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) {
        console.error('Failed to update email log:', updateError);
        throw updateError;
      }

      console.log('Email log updated successfully');
    } catch (error) {
      console.error('Error in updateStatus:', error);
      throw error;
    }
  }

  async getLogs(recipient?: string): Promise<EmailLog[]> {
    try {
      let query = supabase
        .from('email_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (recipient) {
        query = query.eq('recipient', recipient);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Failed to fetch email logs:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getLogs:', error);
      throw error;
    }
  }
}

export const emailLogger = new EmailLogger();
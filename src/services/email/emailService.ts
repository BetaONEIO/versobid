import { emailRenderer } from './emailRenderer';
import { EmailOptions } from './types';
import { emailLogger } from './emailLogger';
import { EmailError } from './errors';

class EmailService {
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.brevo.com/v3/smtp/email';

  constructor() {
    this.apiKey = import.meta.env.VITE_BREVO_API_KEY;
    if (!this.apiKey) {
      console.warn('Brevo API key not configured');
    }
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    let logId: string | undefined;

    try {
      if (!this.apiKey) {
        throw new EmailError('Brevo API key not configured');
      }

      // Create log entry
      const log = await emailLogger.createLog({
        recipient: options.to,
        subject: options.subject,
        template_name: options.templateName
      });
      logId = log.id;

      // Render email content
      const htmlContent = emailRenderer.render(
        {
          name: options.templateName,
          subject: options.subject,
          getParams: () => options.params
        },
        options.params
      );

      // Send email
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': this.apiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: { 
            email: 'noreply@versobid.com',
            name: 'VersoBid'
          },
          to: [{ email: options.to }],
          subject: options.subject,
          htmlContent
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new EmailError(error.message || 'Failed to send email');
      }

      // Update log status
      await emailLogger.updateStatus(log.id, 'sent');
    } catch (error) {
      console.error('Failed to send email:', error);
      
      if (logId) {
        await emailLogger.updateStatus(
          logId, 
          'failed', 
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
      
      throw error instanceof EmailError ? error : new EmailError('Failed to send email');
    }
  }
}

export const emailService = new EmailService();
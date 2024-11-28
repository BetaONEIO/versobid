import { Handler } from '@netlify/functions';
import sgMail from '@sendgrid/mail';

export const handler: Handler = async (event) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email } = JSON.parse(event.body || '{}');

    if (!email) {
      console.log('Email is required');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' })
      };
    }

    // Configure SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

    // Store subscriber email (you can add a database later)
    console.log('New subscriber:', email);

    // Send welcome email
    const msg = {
      to: email,
      from: 'hello@versobid.com', // Verify this email in SendGrid first
      subject: 'Welcome to VersoBid!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Welcome to VersoBid!</h1>
          
          <p>Thanks for joining our waitlist! We're excited to have you on board as we prepare to launch VersoBid - the revolutionary reverse auction platform where buyers set the price and sellers make it happen.</p>
          
          <h2 style="color: #4F46E5;">What's Next?</h2>
          
          <ul>
            <li>You'll be among the first to know when we launch</li>
            <li>Get early access to our platform</li>
            <li>Receive exclusive updates about our progress</li>
          </ul>
          
          <p>In the meantime, if you have any questions, feel free to reach out to us at hello@versobid.com.</p>
          
          <p>Best regards,<br>The VersoBid Team</p>
        </div>
      `
    };

    await sgMail.send(msg);
    console.log('Welcome email sent to:', email);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Successfully subscribed to the waitlist!'
      })
    };
  } catch (error: any) {
    console.error('Subscription error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to subscribe. Please try again later.',
        details: error.message
      })
    };
  }
};
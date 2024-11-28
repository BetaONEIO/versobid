import { Handler } from '@netlify/functions';
import sgMail from '@sendgrid/mail';

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

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

    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

    console.log('New subscriber:', email);

    const msg = {
      to: email,
      from: 'hello@versobid.com',
      subject: 'Welcome to VersoBid!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Welcome to VersoBid!</h1>
          <p>Thanks for joining our waitlist!</p>
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
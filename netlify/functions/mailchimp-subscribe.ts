import { Handler } from '@netlify/functions';
import mailchimp from '@mailchimp/mailchimp_marketing';

interface MailchimpResponse {
  id: string;
  email_address: string;
  status: string;
}

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

    console.log('Configuring Mailchimp...');
    mailchimp.setConfig({
      apiKey: process.env.MAILCHIMP_API_KEY || '',
      server: process.env.MAILCHIMP_SERVER_PREFIX || ''
    });

    console.log('Adding member to list...');
    const response = await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_LIST_ID || '',
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: '',
          LNAME: '',
          SIGNUP_SRC: 'Coming Soon Page',
          SIGNUP_DATE: new Date().toISOString().split('T')[0]
        }
      }
    ) as MailchimpResponse;

    console.log('Successfully added member:', response.id);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Successfully subscribed to the waitlist!',
        id: response.id
      })
    };
  } catch (error: any) {
    console.error('Subscription error:', error);

    if (error.response?.body?.title === 'Member Exists') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'You\'re already subscribed to our waitlist!'
        })
      };
    }

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
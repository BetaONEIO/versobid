// ESM syntax
import mailchimp from '@mailchimp/mailchimp_marketing';

// Configure Mailchimp with the correct server prefix format
const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX.replace(/-us\d+$/, '');

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: serverPrefix,
});

export const handler = async (event) => {
  console.log('Received request:', {
    method: event.httpMethod,
    path: event.path,
    headers: event.headers,
    timestamp: new Date().toISOString(),
  });

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    console.warn('Invalid method:', event.httpMethod);
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('Processing subscription request...');

    if (!event.body) {
      console.error('Missing request body');
      throw new Error('Missing request body');
    }

    const { email } = JSON.parse(event.body);
    console.log('Parsed email:', email);

    if (!email) {
      console.error('Email is required but was not provided');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' }),
      };
    }

    console.log('Mailchimp config:', {
      server: serverPrefix,
      listId: process.env.MAILCHIMP_LIST_ID,
      timestamp: new Date().toISOString(),
    });

    const response = await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
      email_address: email,
      status: 'subscribed',
    });

    console.log('Mailchimp subscription successful:', {
      contactId: response.id,
      email: response.email_address,
      status: response.status,
      timestamp: new Date().toISOString(),
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Successfully subscribed to the waitlist!',
        id: response.id,
      }),
    };
  } catch (error) {
    console.error('Mailchimp subscription error:', {
      error: error.message,
      response: error.response?.body,
      timestamp: new Date().toISOString(),
      stack: error.stack,
    });

    if (error.response?.body?.title === 'Member Exists') {
      console.log('Handling existing member:', {
        error: error.response.body,
        timestamp: new Date().toISOString(),
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'You\'re already subscribed to our waitlist!',
        }),
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message || 'An unexpected error occurred. Please try again.',
        timestamp: new Date().toISOString(),
      }),
    };
  }
};
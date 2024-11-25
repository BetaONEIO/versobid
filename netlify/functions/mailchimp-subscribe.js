const mailchimp = require('@mailchimp/mailchimp_marketing');

// Configure Mailchimp with the correct server prefix format
const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX.replace(/-us\d+$/, '');

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: serverPrefix, // Use only the server prefix without the region
});

const handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Log environment variables for debugging (will be visible in Netlify Functions log)
    console.log('Server Prefix:', process.env.MAILCHIMP_SERVER_PREFIX);
    console.log('List ID:', process.env.MAILCHIMP_LIST_ID);

    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body');
    }

    const { email } = JSON.parse(event.body);
    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' }),
      };
    }

    // Add member to list
    const response = await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
      email_address: email,
      status: 'subscribed',
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
    console.error('Mailchimp error:', error);

    // Handle member already subscribed
    if (error.response && error.response.body && error.response.body.title === 'Member Exists') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'You\'re already subscribed to our waitlist!',
        }),
      };
    }

    // Handle other errors
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message || 'An unexpected error occurred. Please try again.',
      }),
    };
  }
};

module.exports = { handler };
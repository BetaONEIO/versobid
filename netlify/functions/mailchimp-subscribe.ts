import { Handler } from '@netlify/functions';
import mailchimp from '@mailchimp/mailchimp_marketing';

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
      apiKey: process.env.MAILCHIMP_API_KEY,
      server: process.env.MAILCHIMP_SERVER_PREFIX
    });

    // Add subscriber to list with tags and custom fields
    const response = await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
      email_address: email,
      status: 'subscribed',
      tags: ['Waitlist', 'Early Access'],
      merge_fields: {
        FNAME: '',  // Can be populated if you collect first name
        LNAME: '',  // Can be populated if you collect last name
        SIGNUP_SRC: 'Coming Soon Page',
        SIGNUP_DATE: new Date().toISOString().split('T')[0]
      },
      marketing_permissions: [
        {
          marketing_permission_id: 'email',
          enabled: true
        }
      ]
    });

    // Trigger welcome email journey if available
    try {
      // Note: You need to set up the journey/automation in Mailchimp first
      // and use the correct workflow_id
      await mailchimp.customerJourneys.trigger(process.env.MAILCHIMP_WORKFLOW_ID, {
        email_address: email
      });
    } catch (journeyError) {
      console.log('Note: Journey trigger failed, but subscription succeeded:', journeyError);
      // Don't fail the subscription if journey trigger fails
    }

    console.log('Successfully added member:', response.id);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Thanks for subscribing! Check your email for a welcome message.',
        id: response.id
      })
    };
  } catch (error: any) {
    console.error('Subscription error:', error);

    // Handle member exists case
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

    // Log detailed error for debugging
    console.error('Detailed error:', {
      status: error.status,
      response: error.response?.body,
      detail: error.detail || error.message
    });

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
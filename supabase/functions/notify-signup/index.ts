// Follow these steps to enable the Edge Function in Supabase:
// 1. Go to your Supabase project dashboard
// 2. Navigate to Edge Functions
// 3. Create a new function named "notify-signup"
// 4. Copy this code into the function

import { serve } from 'https://deno.fresh.dev/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    // Send email using your preferred email service
    // This example uses a simple fetch to a webhook URL
    // Replace with your actual email service implementation
    const emailData = {
      to: 'hello@versobid.com',
      subject: 'New Waitlist Signup',
      text: `New signup for VersoBid waitlist: ${email}`,
    };

    // Send notification email
    // Replace YOUR_EMAIL_SERVICE_WEBHOOK with actual email service endpoint
    const response = await fetch('YOUR_EMAIL_SERVICE_WEBHOOK', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any required API keys or authentication headers
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return new Response(
      JSON.stringify({ message: 'Notification sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
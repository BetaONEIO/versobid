import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

// Use production endpoints
const EBAY_API_URL = 'https://api.ebay.com/buy/browse/v1/item_summary/search';
const EBAY_AUTH_URL = 'https://api.ebay.com/identity/v1/oauth2/token';

const CLIENT_ID = Deno.env.get('EBAY_CLIENT_ID');
const CLIENT_SECRET = Deno.env.get('EBAY_CLIENT_SECRET');

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Log environment check
    console.log('Environment check:', {
      hasClientId: !!CLIENT_ID,
      hasClientSecret: !!CLIENT_SECRET,
      apiUrl: EBAY_API_URL,
      authUrl: EBAY_AUTH_URL
    });

    const { query } = await req.json();
    console.log('Search query:', query);

    if (!query || query.length < 3) {
      return new Response(
        JSON.stringify({ results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    if (!CLIENT_ID || !CLIENT_SECRET) {
      throw new Error('eBay credentials not configured');
    }

    // Get OAuth token with production scope
    console.log('Requesting OAuth token...');
    const tokenResponse = await fetch(EBAY_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
      },
      body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope'
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('OAuth error:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        response: errorText
      });
      throw new Error(`OAuth failed: ${tokenResponse.status} ${tokenResponse.statusText}`);
    }

    const { access_token } = await tokenResponse.json();
    console.log('OAuth token obtained successfully');

    // Make the search request
    const searchUrl = `${EBAY_API_URL}?q=${encodeURIComponent(query)}&limit=5`;
    console.log('Making search request to:', searchUrl);

    const searchResponse = await fetch(searchUrl, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        'X-EBAY-C-ENDUSERCTX': 'contextualLocation=country=US'
      }
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('Search error:', {
        status: searchResponse.status,
        statusText: searchResponse.statusText,
        response: errorText
      });
      throw new Error(`Search failed: ${searchResponse.status} ${searchResponse.statusText}`);
    }

    const data = await searchResponse.json();
    console.log('Search results:', {
      total: data.total,
      count: data.itemSummaries?.length || 0
    });

    const results = data.itemSummaries?.map((item: any) => ({
      title: item.title,
      imageUrl: item.image?.imageUrl,
      price: item.price ? parseFloat(item.price.value) : undefined,
    })) || [];

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
    );

  } catch (error) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });

    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
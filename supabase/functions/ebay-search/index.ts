import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

// Use production endpoints
const EBAY_API_URL = 'https://api.ebay.com/buy/browse/v1/item_summary/search';
const EBAY_AUTH_URL = 'https://api.ebay.com/identity/v1/oauth2/token';

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get environment variables
    const CLIENT_ID = Deno.env.get('EBAY_CLIENT_ID');
    const CLIENT_SECRET = Deno.env.get('EBAY_CLIENT_SECRET');

    // Log environment check (but don't expose sensitive data)
    console.log('Environment check:', {
      hasClientId: !!CLIENT_ID,
      hasClientSecret: !!CLIENT_SECRET,
      envKeys: Object.keys(Deno.env.toObject())
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
      console.error('Missing eBay credentials');
      throw new Error('eBay credentials not configured');
    }

    // Get OAuth token
    console.log('Requesting OAuth token...');
    const authString = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    console.log('Auth string length:', authString.length);

    const tokenResponse = await fetch(EBAY_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authString}`,
      },
      body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope/buy.item.feed https://api.ebay.com/oauth/api_scope/buy.marketing https://api.ebay.com/oauth/api_scope/buy.item.bulk.get'
    });

    // Log token response status
    console.log('Token response status:', tokenResponse.status);

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('OAuth error:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        headers: Object.fromEntries(tokenResponse.headers.entries()),
        response: errorText
      });
      throw new Error(`OAuth failed: ${tokenResponse.status} ${tokenResponse.statusText} - ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    console.log('OAuth response received:', {
      hasToken: !!tokenData.access_token,
      expiresIn: tokenData.expires_in,
      tokenType: tokenData.token_type
    });

    // Make the search request
    const searchUrl = `${EBAY_API_URL}?q=${encodeURIComponent(query)}&limit=5`;
    console.log('Making search request to:', searchUrl);

    const searchResponse = await fetch(searchUrl, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_GB',
        'X-EBAY-C-ENDUSERCTX': 'contextualLocation=country=GB'
      }
    });

    // Log search response status
    console.log('Search response status:', searchResponse.status);

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('Search error:', {
        status: searchResponse.status,
        statusText: searchResponse.statusText,
        headers: Object.fromEntries(searchResponse.headers.entries()),
        response: errorText
      });
      throw new Error(`Search failed: ${searchResponse.status} ${searchResponse.statusText} - ${errorText}`);
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
          message: error.message
        }
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
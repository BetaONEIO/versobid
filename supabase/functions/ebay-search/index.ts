import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const EBAY_API_URL = 'https://api.ebay.com/buy/browse/v1/item_summary/search';

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query } = await req.json();

    if (!query || query.length < 3) {
      return new Response(
        JSON.stringify({ results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    // For now, return mock data since we don't have valid eBay credentials
    const mockResults = [
      {
        title: `Sample Item for "${query}"`,
        price: 99.99
      },
      {
        title: `Another Item matching "${query}"`,
        price: 149.99
      }
    ];

    return new Response(
      JSON.stringify({ results: mockResults }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
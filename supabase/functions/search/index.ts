import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const SERPAPI_KEY = Deno.env.get('SERPAPI_KEY');
const BASE_URL = 'https://serpapi.com/search.json';

interface SearchResponse {
  results: Array<{
    title: string;
    imageUrl?: string;
    price?: number;
    condition?: string;
    brand?: string;
    shortDescription?: string;
  }>;
  priceAnalysis?: {
    suggestedRange: {
      minPrice: number;
      maxPrice: number;
      marketPrice: number;
    };
    confidence: string;
    basedOn: number;
    note: string;
  };
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!SERPAPI_KEY) {
      throw new Error('SERPAPI_KEY environment variable not configured');
    }

    const { query } = await req.json();
    
    if (!query || query.length < 3) {
      return new Response(
        JSON.stringify({ results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    // Build search parameters
    const params = new URLSearchParams({
      api_key: SERPAPI_KEY,
      engine: 'google_shopping',
      q: query,
      google_domain: 'google.co.uk',
      gl: 'uk',
      hl: 'en',
      currency: 'GBP',
      safe: 'active'
    });

    // Make request to SerpAPI
    const response = await fetch(`${BASE_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`SerpAPI request failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.shopping_results) {
      return new Response(
        JSON.stringify({ results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    // Transform results
    const results = data.shopping_results.map((item: any) => ({
      title: item.title,
      imageUrl: item.thumbnail,
      price: parseFloat(item.price?.replace(/[^0-9.]/g, '') || '0'),
      condition: item.condition || 'New',
      brand: item.brand || '',
      shortDescription: item.snippet || ''
    }));

    // Calculate price analysis
    const prices = results
      .map(r => r.price)
      .filter((p): p is number => !isNaN(p) && p > 0);

    let priceAnalysis;
    if (prices.length > 0) {
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      priceAnalysis = {
        suggestedRange: {
          minPrice: Math.floor(avgPrice * 0.85),
          maxPrice: Math.ceil(avgPrice * 1.15),
          marketPrice: Math.round(avgPrice)
        },
        confidence: prices.length > 3 ? 'high' : 'medium',
        basedOn: prices.length,
        note: 'Based on current market prices (±15%)'
      };
    }

    const searchResponse: SearchResponse = {
      results,
      ...(priceAnalysis && { priceAnalysis })
    };

    return new Response(
      JSON.stringify(searchResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
    );

  } catch (error) {
    console.error('Search error:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})
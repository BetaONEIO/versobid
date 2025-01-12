import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

// Use production endpoints
const EBAY_API_URL = 'https://api.ebay.com/buy/browse/v1/item_summary/search';
const EBAY_AUTH_URL = 'https://api.ebay.com/identity/v1/oauth2/token';

// Price range calculation function
function calculatePriceRange(price: number) {
  return {
    minPrice: Math.round(price * 0.85), // 15% below market price
    maxPrice: Math.round(price * 1.15), // 15% above market price
    marketPrice: price
  };
}

// Calculate average price from results
function calculateAveragePrice(items: any[]) {
  const prices = items
    .map(item => item.price?.value ? parseFloat(item.price.value) : null)
    .filter(price => price !== null);
  
  if (prices.length === 0) return null;
  
  const sum = prices.reduce((a, b) => a + b, 0);
  return sum / prices.length;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const CLIENT_ID = Deno.env.get('EBAY_CLIENT_ID');
    const CLIENT_SECRET = Deno.env.get('EBAY_CLIENT_SECRET');

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

    // Get OAuth token
    const authString = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const tokenResponse = await fetch(EBAY_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authString}`,
      },
      body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope/buy.item.feed https://api.ebay.com/oauth/api_scope/buy.marketing https://api.ebay.com/oauth/api_scope/buy.item.bulk.get'
    });

    if (!tokenResponse.ok) {
      throw new Error(`OAuth failed: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();

    // Enhanced search request with additional fields
    const searchUrl = `${EBAY_API_URL}?` + new URLSearchParams({
      q: query,
      limit: '10', // Increased to get better average
      fieldgroups: 'EXTENDED',
      sort: 'newlyListed',
      filter: 'conditions:{NEW|USED}',
    });

    const searchResponse = await fetch(searchUrl, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_GB',
        'X-EBAY-C-ENDUSERCTX': 'contextualLocation=country=GB'
      }
    });

    if (!searchResponse.ok) {
      throw new Error(`Search failed: ${searchResponse.status}`);
    }

    const data = await searchResponse.json();

    // Calculate average price and suggested range
    const averagePrice = calculateAveragePrice(data.itemSummaries || []);
    const priceRange = averagePrice ? calculatePriceRange(averagePrice) : null;

    // Enhanced result mapping with additional fields
    const results = data.itemSummaries?.map((item: any) => ({
      title: item.title,
      imageUrl: item.image?.imageUrl,
      thumbnailImages: item.thumbnailImages,
      additionalImages: item.additionalImages,
      price: item.price ? parseFloat(item.price.value) : undefined,
      condition: item.condition,
      itemLocation: item.itemLocation,
      seller: {
        username: item.seller?.username,
        feedbackScore: item.seller?.feedbackScore,
        feedbackPercentage: item.seller?.feedbackPercentage
      },
      shippingOptions: item.shippingOptions,
      buyingOptions: item.buyingOptions,
      itemWebUrl: item.itemWebUrl,
      categories: item.categories,
      shortDescription: item.shortDescription,
      brand: item.brand,
      mpn: item.mpn,
      epid: item.epid
    })) || [];

    return new Response(
      JSON.stringify({ 
        results,
        total: data.total,
        limit: data.limit,
        offset: data.offset,
        priceAnalysis: priceRange ? {
          suggestedRange: priceRange,
          confidence: 'medium',
          basedOn: results.length,
          note: 'Suggested price range based on current market prices (±15%)'
        } : null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
    );

  } catch (error) {
    console.error('Error:', error);
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
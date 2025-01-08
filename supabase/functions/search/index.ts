import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'
import { supabaseClient } from '../_shared/supabaseClient.ts'

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query } = await req.json()
    
    if (!query || query.length < 3) {
      return new Response(
        JSON.stringify({ items: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      )
    }

    // Search items using text search
    const { data: items, error } = await supabaseClient
      .from('items')
      .select('title, min_price')
      .textSearch('title', query)
      .limit(5)

    if (error) throw error

    // Map the results to match the frontend expectations
    const results = items.map(item => ({
      title: item.title,
      price: item.min_price
    }))

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
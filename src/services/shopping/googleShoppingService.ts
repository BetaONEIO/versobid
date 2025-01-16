import { SearchResult } from '../../types/search';
import { supabase } from '../../lib/supabase';

interface SearchResponse {
  results: SearchResult[];
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

class GoogleShoppingService {
  private static instance: GoogleShoppingService | null = null;
  private lastCallTime: number = 0;
  private readonly minCallInterval = 300; // 300ms between calls

  private constructor() {
    console.log('GoogleShoppingService initialized');
  }

  public static getInstance(): GoogleShoppingService {
    if (!GoogleShoppingService.instance) {
      GoogleShoppingService.instance = new GoogleShoppingService();
    }
    return GoogleShoppingService.instance;
  }

  private async rateLimitedFetch(url: string, options: RequestInit): Promise<Response> {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCallTime;
    
    if (timeSinceLastCall < this.minCallInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minCallInterval - timeSinceLastCall)
      );
    }
    
    this.lastCallTime = Date.now();
    return fetch(url, options);
  }

  async searchProducts(query: string): Promise<SearchResponse> {
    if (!query || query.length < 3) {
      return { results: [] };
    }

    try {
      // Get the function URL from Supabase
      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search`;
      
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      const authHeader = session ? `Bearer ${session.access_token}` : '';

      const response = await this.rateLimitedFetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Search request failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error instanceof Error ? error : new Error('Failed to search products');
    }
  }
}

export const googleShoppingService = GoogleShoppingService.getInstance();
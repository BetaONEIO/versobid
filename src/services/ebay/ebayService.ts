import { SearchResult } from '../../types/search';
import { supabase } from '../../lib/supabase';

export interface EbaySearchResponse {
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
  total?: number;
  limit?: number;
  offset?: number;
}

class EbayService {
  private static instance: EbayService;

  private constructor() {}

  static getInstance(): EbayService {
    if (!this.instance) {
      this.instance = new EbayService();
    }
    return this.instance;
  }

  async searchItems(query: string): Promise<EbaySearchResponse> {
    if (!query || query.length < 3) {
      return { results: [] };
    }

    try {
      const { data, error } = await supabase.functions.invoke('ebay-search', {
        body: { query }
      });

      if (error) {
        console.error('Error calling eBay search function:', error);
        return { results: [] };
      }

      if (data.error) {
        console.error('eBay search error:', data.error);
        return { results: [] };
      }

      return data;
    } catch (error) {
      console.error('Error fetching eBay suggestions:', error);
      return { results: [] };
    }
  }
}

export const ebayService = EbayService.getInstance();
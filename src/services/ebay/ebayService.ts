import { SearchResult } from '../../types/search';
import { supabase } from '../../lib/supabase';

class EbayService {
  private static instance: EbayService;

  private constructor() {}

  static getInstance(): EbayService {
    if (!this.instance) {
      this.instance = new EbayService();
    }
    return this.instance;
  }

  async searchItems(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 3) {
      return [];
    }

    try {
      const { data, error } = await supabase.functions.invoke('ebay-search', {
        body: { query }
      });

      if (error) {
        console.error('Error calling eBay search function:', error);
        return [];
      }

      return data.results || [];
    } catch (error) {
      console.error('Error fetching eBay suggestions:', error);
      return [];
    }
  }
}

export const ebayService = EbayService.getInstance();
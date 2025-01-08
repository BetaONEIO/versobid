import { SearchResult } from '../../types/search';

const EBAY_API_URL = 'https://api.ebay.com/buy/browse/v1/item_summary/search';
const EBAY_API_KEY = import.meta.env.VITE_EBAY_API_KEY;

class EbayService {
  private static instance: EbayService;
  private readonly headers: HeadersInit;

  private constructor() {
    this.headers = {
      'Authorization': `Bearer ${EBAY_API_KEY}`,
      'Content-Type': 'application/json',
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
    };
  }

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
      const response = await fetch(
        `${EBAY_API_URL}?q=${encodeURIComponent(query)}&limit=5`,
        { headers: this.headers }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('eBay API error:', error);
        return [];
      }

      const data = await response.json();
      return this.mapSearchResults(data);
    } catch (error) {
      console.error('Error fetching eBay suggestions:', error);
      return [];
    }
  }

  private mapSearchResults(data: any): SearchResult[] {
    if (!data.itemSummaries) {
      return [];
    }

    return data.itemSummaries.map((item: any) => ({
      title: item.title,
      imageUrl: item.image?.imageUrl,
      price: item.price ? parseFloat(item.price.value) : undefined,
    }));
  }
}

export const ebayService = EbayService.getInstance();
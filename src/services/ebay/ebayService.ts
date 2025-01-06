import { SearchResult } from '../../types/search';
import { EbaySearchResponse, EbayItemSummary } from './types';

const EBAY_API_KEY = import.meta.env.VITE_EBAY_API_KEY;
const EBAY_API_URL = 'https://api.ebay.com/buy/browse/v1/item_summary/search';

export class EbayService {
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
    if (!EBAY_API_KEY) {
      console.warn('eBay API key not configured');
      return [];
    }

    try {
      const response = await fetch(
        `${EBAY_API_URL}?q=${encodeURIComponent(query)}&limit=5`,
        { headers: this.headers }
      );

      if (!response.ok) {
        throw new Error(`eBay API error: ${response.statusText}`);
      }

      const data = await response.json() as EbaySearchResponse;
      return this.mapSearchResults(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  }

  private mapSearchResults(data: EbaySearchResponse): SearchResult[] {
    return data.itemSummaries?.map((item: EbayItemSummary) => ({
      title: item.title,
      imageUrl: item.image?.imageUrl,
      price: item.price ? parseFloat(item.price.value) : undefined,
    })) || [];
  }
}

export const ebayService = EbayService.getInstance();
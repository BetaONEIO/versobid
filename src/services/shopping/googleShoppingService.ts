import { SearchResult } from '../../types/search';

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
  private readonly apiKey: string;
  private readonly apiEndpoint = 'https://serpapi.com/search.json';
  private lastCallTime: number = 0;
  private readonly minCallInterval = 1000; // Minimum 1 second between calls

  private constructor() {
    this.apiKey = import.meta.env.VITE_SERPAPI_KEY;
    if (!this.apiKey) {
      console.error('VITE_SERPAPI_KEY environment variable is missing');
    }
  }

  public static getInstance(): GoogleShoppingService {
    if (!GoogleShoppingService.instance) {
      GoogleShoppingService.instance = new GoogleShoppingService();
    }
    return GoogleShoppingService.instance;
  }

  private validateApiKey() {
    if (!this.apiKey) {
      throw new Error('SERPAPI key not configured. Please check your environment variables.');
    }
  }

  private async rateLimitedFetch(url: string): Promise<Response> {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCallTime;
    
    if (timeSinceLastCall < this.minCallInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minCallInterval - timeSinceLastCall)
      );
    }
    
    this.lastCallTime = Date.now();
    return fetch(url);
  }

  async searchProducts(query: string): Promise<SearchResponse> {
    if (!query || query.length < 3) {
      return { results: [] };
    }

    try {
      this.validateApiKey();

      const params = new URLSearchParams({
        api_key: this.apiKey,
        engine: 'google_shopping',
        q: query,
        country: 'uk',
        currency: 'GBP',
        gl: 'uk',
        hl: 'en'
      });

      const response = await this.rateLimitedFetch(`${this.apiEndpoint}?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch search results');
      }

      const data = await response.json();
      
      const results: SearchResult[] = data.shopping_results?.map((item: any) => ({
        title: item.title,
        imageUrl: item.thumbnail,
        price: parseFloat(item.price.replace(/[^0-9.]/g, '')),
        condition: item.condition || 'New',
        brand: item.brand || undefined,
        shortDescription: item.snippet,
        categories: item.categories?.map((cat: string) => ({
          categoryId: cat.toLowerCase(),
          categoryName: cat
        }))
      })) || [];

      const priceAnalysis = this.analyzePrices(results);

      return {
        results,
        ...(priceAnalysis && { priceAnalysis })
      };
    } catch (error) {
      console.error('Error searching products:', error);
      throw error instanceof Error ? error : new Error('Failed to search products');
    }
  }

  private analyzePrices(results: SearchResult[]): SearchResponse['priceAnalysis'] | undefined {
    if (results.length === 0) return undefined;

    const prices = results.map(r => r.price).filter((p): p is number => p !== undefined);
    if (prices.length === 0) return undefined;

    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    
    return {
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
}

export const googleShoppingService = GoogleShoppingService.getInstance();
import { SearchResult } from '../../types/search';

const EBAY_API_URL = 'https://api.ebay.com/buy/browse/v1/item_summary/search';
const EBAY_API_KEY = 'v^1.1#i^1#r^0#I^3#f^0#p^1#t^H4sIAAAAAAAAAOVYXWwUVRTu9k8QqxKxRSK4GX2gtDNzZ2Z/B3Zx+0e3lLay24JFA3dn7rRDZ2eWmTu2m2hoNpECiSIJSKwP8iAKL6KSoOKLP0hBKDwYIBpjNEoU/CExUX6iiXe2pWwrgUI3sYnzMrn3nnPu+b57zj33XtBfOnPRpsZNl8pcdxXu7gf9hS4XNwvMLC2pereocF5JAcgRcO3uf6y/OFP00xILJrWUuBJZKUO3kLsvqemWmO0MUbapiwa0VEvUYRJZIpbEWGRFs8gzQEyZBjYkQ6Pc0boQ5fEE/TISFI8EON4vK6RXv2YzboQoIQFk2QdlhIIeIHl9ZNyybBTVLQx1HKJ4wHtpwNHAH+c4kQ+IHp7xCcFOyt2BTEs1dCLCACqcdVfM6po5vt7cVWhZyMTECBWORhpirZFoXX1LfAmbYys8ykMMQ2xb41u1hozcHVCz0c2nsbLSYsyWJGRZFBsemWG8UTFyzZk7cD9LNQyAoNfr5RH0+gXOmxcmGwwzCfHN3XB6VJlWsqIi0rGK07cilJCRWI8kPNpqISaidW7n94QNNVVRkRmi6msiT0ba2qhwDcKwtaU+SjeouhzFKEnHalbTsgIDnCAAD+2B/qASkKXRiUasjbI8YaZaQ5dVhzPL3WLgGkS8RhO54XK4IUKteqsZUbDjUa6cMMYh3+ms6cgi2rhbd5YVJQkR7mzz1iswpo2xqSZsjMYsTBzIUkSWOpVSZWriYDYUR6OnzwpR3RinRJbt7e1legXGMLtYHgCOXb2iOSZ1oySkHFkn17Py6q0VaDULRUJE01JFnE4RX/pIqBIH9C4q7BG8QY8wyvt4t8ITe//VkYOZHZ8Q+UqQgAITgOOAwHsVHwgE8pEh4dEgZR0/UAKm6SQ0exBOaVBCtETizE4iU5VFwavwQkBBtOwLKrQnqCh0wiv7aE5BCCCUSEjBwP8pUSYb6jEkmQjnJ9bzFee9RiPqjVT1JP0sF4Nd9dGqus6UtWpDY3dtW1NDPNCstfaYgFdYzhOabDbcEHytphJm4mT+vBDg5HreSGg0LIzkKcGLSUYKtRmaKqWn1wILptwGTZyusdOkHUOaRn5TghpJpaJ52rHzBfI2N4s7w53HSvXfVKkborKcwJ1eqBx9ixiAKZVx6pCT64xkJFkDkkOI070267V7ouCNhNiEnWa6bGRh4olMzoGTVlJJHDGkpMmTVxkpmATE5FXIHUO2JXxHE2UrM0PYVLu6sXVbc/ZNhZSErfVMXkVGUJtSiKrkpjGtApQgHYGsyiN3BCaLm7GekRgTWYZtktsR0+ocmeNGD9LJAQSbhqYhs4Ob8tabTNoYJjQ03fbgPOxFKsTFGdel6YWL8ws+3hMUeH5K2KTs+WftdKsg+a6ct3ETYsc/y4QLsh+XcX0OMq4jhS4XqAM0VwUqS4vai4vuoSyy9zAW1OWE0ceoUGHItqdDbJuI6UHpFFTNwgcKjm8oqO6/u5F9e+tTmar4+nTBjJzXod1Pg7lj70Mzi7hZOY9F4OHrIyXcfRVlvBdwwM9xfMDDd4JHr48Wc+XFc3ZcLjr11eDZg0fea38Nh8QZG3XqKigbE3K5SgpIKBd4N//y9em+BB/ae7yU3TI8u2Lb/o+rX/ioaWN10zCuX84v+OHwdv/hBSe3gSWnLvaeXOMT2vT5327e/M6iwYHCWEXl1uGy4+KcWTsGEsK5mj+Gqz/Ze3bw9T2hlqryOd9VnxkK0ouq5s5/Nmm9++bx+4cjnkNrXhyq3FlZsO/gK4uXXhn6ZrFavvOth76fd6KwofnS+VV7upvO+PcXZ2ZHh//u3/cXPHbuyqFdmaPLFiz/tdh3ci+3Yf/lCx3nDuinB17ePlhHvXHApXyxcOlvO/88evGRF3YNZeY2fPDjni9PlHU99/66V7fMvlDi/fSYvO7s7xUfnjo/wIJN69p//qx84fMvxR9c9rjdfjVxbOXImv4DjQUTnrcTAAA=';

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
    try {
      const response = await fetch(
        `${EBAY_API_URL}?q=${encodeURIComponent(query)}&limit=5`,
        { headers: this.headers }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `eBay API error: ${response.statusText}`);
      }

      const data = await response.json();
      return this.mapSearchResults(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  }

  private mapSearchResults(data: any): SearchResult[] {
    return data.itemSummaries?.map((item: any) => ({
      title: item.title,
      imageUrl: item.image?.imageUrl,
      price: item.price ? parseFloat(item.price.value) : undefined,
    })) || [];
  }
}

export const ebayService = EbayService.getInstance();
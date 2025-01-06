import { SearchResult } from './types';

const EBAY_API_KEY = (import.meta.env.VITE_EBAY_API_KEY as string) || '';
const EBAY_API_URL = 'https://api.ebay.com/buy/browse/v1/item_summary/search';

export async function searchItems(query: string): Promise<SearchResult[]> {
  if (!EBAY_API_KEY) {
    console.warn('eBay API key not configured');
    return [];
  }

  try {
    const response = await fetch(
      `${EBAY_API_URL}?q=${encodeURIComponent(query)}&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${EBAY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`eBay API error: ${response.statusText}`);
    }

    const data = await response.json();

    return (
      data.itemSummaries?.map((item: any) => ({
        title: item.title,
        imageUrl: item.image?.imageUrl,
        price: parseFloat(item.price?.value || '0'),
      })) || []
    );
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
}
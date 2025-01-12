import { useState } from 'react';
import { SearchResult } from '../types/search';
import { ebayService, EbaySearchResponse } from '../services/ebay/ebayService';
import { useNotification } from '../contexts/NotificationContext';
import { debounce } from '../utils/debounce';

type PriceAnalysis = NonNullable<EbaySearchResponse['priceAnalysis']>;

export const useEbaySearch = () => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [priceAnalysis, setPriceAnalysis] = useState<PriceAnalysis | null>(null);
  const { addNotification } = useNotification();

  const searchItemsDebounced = debounce(async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      setPriceAnalysis(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await ebayService.searchItems(query);
      setSuggestions(data.results);
      setPriceAnalysis(data.priceAnalysis || null);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      addNotification('error', 'Failed to fetch item suggestions');
      setSuggestions([]);
      setPriceAnalysis(null);
    } finally {
      setLoading(false);
    }
  }, 300);

  return {
    loading,
    suggestions,
    priceAnalysis,
    searchItems: searchItemsDebounced
  };
};